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
    
    // Sử dụng API từ provinces.open-api.vn thay thế
    const provinceRes = await axios.get('https://provinces.open-api.vn/api/p/');
    const provinces = provinceRes.data;
    
    console.log(`📊 Đã lấy dữ liệu ${provinces.length} tỉnh/thành phố`);
    
    // Bắt đầu transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Xóa dữ liệu cũ
      console.log('🧹 Xóa dữ liệu cũ...');
      await queryRunner.query('DELETE FROM PHUONG_XA');
      await queryRunner.query('DELETE FROM QUAN_HUYEN');
      await queryRunner.query('DELETE FROM TINH_THANHPHO');
      
      // Đặt lại identity
      await queryRunner.query('DBCC CHECKIDENT (\'PHUONG_XA\', RESEED, 0)');
      await queryRunner.query('DBCC CHECKIDENT (\'QUAN_HUYEN\', RESEED, 0)');
      await queryRunner.query('DBCC CHECKIDENT (\'TINH_THANHPHO\', RESEED, 0)');
      
      console.log('✅ Đã xóa dữ liệu cũ, bắt đầu nhập dữ liệu mới...');
      
      let provinceCount = 0;
      let districtCount = 0;
      let wardCount = 0;
      
      // Xử lý từng tỉnh/thành phố
      for (const province of provinces) {
        // Thêm tỉnh
        const tinhThanh = new TINH_THANHPHO();
        tinhThanh.tenTinhThanh = province.name;
        const savedProvince = await queryRunner.manager.save(tinhThanh);
        provinceCount++;
        
        console.log(`📍 Đang nhập tỉnh/thành phố ${provinceCount}/${provinces.length}: ${tinhThanh.tenTinhThanh} (code: ${province.code})`);
        
        try {
          // Lấy danh sách quận/huyện của tỉnh/thành phố
          const districtsRes = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
          const districts = districtsRes.data.districts || [];
          
          console.log(`  ↳ Đang xử lý ${districts.length} quận/huyện của ${tinhThanh.tenTinhThanh}`);
          
          // Xử lý từng quận/huyện
          for (const district of districts) {
            // Thêm quận/huyện
            const quanHuyen = new QUAN_HUYEN();
            quanHuyen.tenQuanHuyen = district.name;
            quanHuyen.maTinhThanhPho = savedProvince.id;
            const savedDistrict = await queryRunner.manager.save(quanHuyen);
            districtCount++;
            
            try {
              // Lấy danh sách phường/xã của quận/huyện
              const wardsRes = await axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
              const wards = wardsRes.data.wards || [];
              
              // Tạo các phường/xã theo lô
              const BATCH_SIZE = 100;
              for (let i = 0; i < wards.length; i += BATCH_SIZE) {
                interface Ward {
                  name: string;
                  code: string;
                }
                
                const wardBatch = wards.slice(i, i + BATCH_SIZE).map((ward: Ward) => {
                  const phuongXa = new PHUONG_XA();
                  phuongXa.tenPhuongXa = ward.name;
                  phuongXa.maQuanHuyen = savedDistrict.id;
                  return phuongXa;
                });
                
                if (wardBatch.length > 0) {
                  await queryRunner.manager.save(PHUONG_XA, wardBatch);
                  wardCount += wardBatch.length;
                }
              }
              
              console.log(`    ↳ Đã thêm ${wards.length} phường/xã vào quận/huyện ${quanHuyen.tenQuanHuyen}`);
            } catch (error) {
              console.warn(`    ⚠️ Không thể lấy dữ liệu phường/xã cho quận/huyện ${district.name} (${district.code}): `);
              continue; // Tiếp tục với quận/huyện tiếp theo
            }
          }
        } catch (error) {
          console.warn(`  ⚠️ Không thể lấy dữ liệu quận/huyện cho tỉnh/thành phố ${province.name} (${province.code}): `);
          continue; // Tiếp tục với tỉnh/thành phố tiếp theo
        }
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      console.log('✅ Nhập dữ liệu thành công!');
      console.log(`📊 Tổng số tỉnh/thành phố: ${provinceCount}`);
      console.log(`📊 Tổng số quận/huyện: ${districtCount}`);
      console.log(`📊 Tổng số phường/xã: ${wardCount}`);
      
      // Kiểm tra dữ liệu đã nhập
      const tinhCount = await AppDataSource.getRepository(TINH_THANHPHO).count();
      const huyenCount = await AppDataSource.getRepository(QUAN_HUYEN).count();
      const xaCount = await AppDataSource.getRepository(PHUONG_XA).count();
      
      console.log('📊 Số lượng dữ liệu trong CSDL:');
      console.log(`- Tỉnh/thành phố: ${tinhCount}`);
      console.log(`- Quận/huyện: ${huyenCount}`);
      console.log(`- Phường/xã: ${xaCount}`);
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Lỗi khi nhập dữ liệu:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    try {
      await AppDataSource.destroy();
      console.log('🔒 Đã đóng kết nối cơ sở dữ liệu');
    } catch (e) {
      console.error('❌ Lỗi khi đóng kết nối cơ sở dữ liệu:', e);
    }
  }
}

// Chạy hàm import
console.log('📋 Bắt đầu quá trình nhập dữ liệu địa chính Việt Nam...');
importLocationData().catch(error => {
  console.error('❌ Lỗi không xử lý được:', error);
  process.exit(1);
});