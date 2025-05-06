import axios from 'axios';
import { AppDataSource } from '../data-source';
import { TINH_THANHPHO } from '../entities/tinhThanh.entity';
import { QUAN_HUYEN } from '../entities/huyen.entity';
import { PHUONG_XA } from '../entities/phuongXa.entity';

async function importLocationData() {
  try {
    console.log('🚀 Bắt đầu khởi tạo kết nối đến cơ sở dữ liệu...');
    await AppDataSource.initialize();
    console.log('✅ Kết nối cơ sở dữ liệu thành công');

    console.log('🚀 Bắt đầu lấy dữ liệu từ API...');
    const provinceRes = await axios.get('https://provinces.open-api.vn/api/p/?depth=3');
    const provinces = provinceRes.data;
    console.log(`📊 Đã lấy dữ liệu của ${provinces.length} tỉnh/thành phố`);

    // Bắt đầu transaction để đảm bảo tính nhất quán của dữ liệu
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Xóa dữ liệu cũ theo đúng thứ tự (từ con đến cha)
      console.log('🧹 Xóa dữ liệu cũ nếu có...');
      
      // SQL Server specific - tắt ràng buộc khóa ngoại tạm thời
      await queryRunner.query('ALTER TABLE PHUONG_XA NOCHECK CONSTRAINT ALL');
      await queryRunner.query('ALTER TABLE QUAN_HUYEN NOCHECK CONSTRAINT ALL');
      await queryRunner.query('ALTER TABLE TINH_THANHPHO NOCHECK CONSTRAINT ALL');
      
      // Xóa dữ liệu
      await queryRunner.query('DELETE FROM PHUONG_XA');
      await queryRunner.query('DELETE FROM QUAN_HUYEN');
      await queryRunner.query('DELETE FROM TINH_THANHPHO');
      
      // Đặt lại identity (auto-increment) cho SQL Server
      await queryRunner.query('DBCC CHECKIDENT (\'PHUONG_XA\', RESEED, 0)');
      await queryRunner.query('DBCC CHECKIDENT (\'QUAN_HUYEN\', RESEED, 0)');
      await queryRunner.query('DBCC CHECKIDENT (\'TINH_THANHPHO\', RESEED, 0)');
      
      // Bật lại ràng buộc
      await queryRunner.query('ALTER TABLE PHUONG_XA CHECK CONSTRAINT ALL');
      await queryRunner.query('ALTER TABLE QUAN_HUYEN CHECK CONSTRAINT ALL');
      await queryRunner.query('ALTER TABLE TINH_THANHPHO CHECK CONSTRAINT ALL');
      
      console.log('🚀 Bắt đầu nhập dữ liệu...');
      
      let provinceCount = 0;
      let districtCount = 0;
      let wardCount = 0;
      
      // Lưu trữ dữ liệu theo lô để tăng hiệu suất
      const provinceBatch = [];
      
      for (const p of provinces) {
        // Tạo và lưu tỉnh/thành phố
        const tinhThanh = new TINH_THANHPHO();
        tinhThanh.tenTinhThanh = p.name;
        const savedTinhThanh = await queryRunner.manager.save(tinhThanh);
        provinceCount++;
        
        console.log(`📍 Đang xử lý tỉnh/thành phố ${provinceCount}/${provinces.length}: ${tinhThanh.tenTinhThanh}`);
        
        // Reset để theo dõi tiến trình
        let currentDistrictIndex = 0;
        const totalDistricts = p.districts ? p.districts.length : 0;
        
        // Xử lý Quận/Huyện
        if (p.districts && Array.isArray(p.districts) && p.districts.length > 0) {
          
          // Lưu trữ dữ liệu theo lô để tăng hiệu suất
          const districtBatch = [];
          
          for (const d of p.districts) {
            currentDistrictIndex++;
            if (currentDistrictIndex % 10 === 0 || currentDistrictIndex === totalDistricts) {
              console.log(`  ↳ Đang xử lý quận/huyện: ${currentDistrictIndex}/${totalDistricts}`);
            }
            
            // Tạo quận/huyện
            const quanHuyen = new QUAN_HUYEN();
            quanHuyen.tenQuanHuyen = d.name;
            quanHuyen.maTinhThanhPho = savedTinhThanh.id;
            const savedQuanHuyen = await queryRunner.manager.save(quanHuyen);
            districtCount++;
            
            // Xử lý Phường/Xã
            if (d.wards && Array.isArray(d.wards) && d.wards.length > 0) {
              // Xử lý phường/xã theo lô
              const wardBatch = [];
              
              for (const w of d.wards) {
                const phuongXa = new PHUONG_XA();
                phuongXa.tenPhuongXa = w.name;
                phuongXa.maQuanHuyen = savedQuanHuyen.id;
                wardBatch.push(phuongXa);
              }
              
              // Lưu hàng loạt phường/xã
              if (wardBatch.length > 0) {
                await queryRunner.manager.save(PHUONG_XA, wardBatch);
                wardCount += wardBatch.length;
                console.log(`    ↳ Đã thêm ${wardBatch.length} phường/xã vào quận/huyện ${savedQuanHuyen.tenQuanHuyen}`);
              }
            }
          }
        }
      }
      
      // Commit transaction nếu thành công
      await queryRunner.commitTransaction();
      
      console.log('✅ Nhập dữ liệu thành công!');
      console.log(`📊 Tổng số tỉnh/thành phố: ${provinceCount}`);
      console.log(`📊 Tổng số quận/huyện: ${districtCount}`);
      console.log(`📊 Tổng số phường/xã: ${wardCount}`);
      
    } catch (error) {
      // Rollback nếu có lỗi
      console.error('❌ Lỗi khi nhập dữ liệu:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Giải phóng query runner
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    // Đóng kết nối
    try {
      await AppDataSource.destroy();
      console.log('🔒 Đã đóng kết nối cơ sở dữ liệu');
    } catch (error) {
      console.error('❌ Lỗi khi đóng kết nối:', error);
    }
  }
}

// Chạy hàm import
console.log('📋 Bắt đầu quá trình nhập dữ liệu địa chính Việt Nam...');
importLocationData().catch(error => {
  console.error('❌ Lỗi không xử lý được:', error);
  process.exit(1);
});