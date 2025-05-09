import { AppDataSource } from '../data-source';
import { DIACHI_GIAOHANG } from '../entities/diaChiGiaoHang.entity';

const repo = AppDataSource.getRepository(DIACHI_GIAOHANG);

// Lấy tất cả địa chỉ giao hàng
export const getAllDiaChiGiaoHang = async () => {
  return await repo.find({
    relations: ['nguoiDung', 'tinhThanhPho', 'quanHuyen', 'phuongXa'],
  });
};

// Lấy địa chỉ giao hàng theo ID
export const getDiaChiGiaoHangById = async (id: number) => {
  return await repo.findOne({
    where: { id },
    relations: ['nguoiDung', 'tinhThanhPho', 'quanHuyen', 'phuongXa'],
  });
};

// Lấy địa chỉ giao hàng theo người dùng
export const getDiaChiGiaoHangByNguoiDung = async (maNguoiDung: number) => {
  return await repo.find({
    where: { maNguoiDung },
    relations: ['nguoiDung', 'tinhThanhPho', 'quanHuyen', 'phuongXa'],
    order: {
      laDiaChiMacDinh: 'DESC',
      ngayTao: 'DESC',
    },
  });
};

// Tạo địa chỉ giao hàng mới
export const createDiaChiGiaoHang = async (data: Partial<DIACHI_GIAOHANG>) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Nếu đang tạo địa chỉ mặc định, hủy tất cả địa chỉ mặc định trước đó
    if (data.laDiaChiMacDinh) {
      await queryRunner.manager.update(
        DIACHI_GIAOHANG,
        { maNguoiDung: data.maNguoiDung, laDiaChiMacDinh: true },
        { laDiaChiMacDinh: false }
      );
    }

    // Tạo địa chỉ mới
    const diaChi = repo.create(data);
    diaChi.ngayTao = new Date();
    const savedAddress = await queryRunner.manager.save(diaChi);

    // Kiểm tra nếu chưa có địa chỉ mặc định, đặt địa chỉ đầu tiên làm mặc định
    const count = await queryRunner.manager.count(DIACHI_GIAOHANG, {
      where: { maNguoiDung: data.maNguoiDung },
    });

    if (count === 1 && !data.laDiaChiMacDinh) {
      await queryRunner.manager.update(
        DIACHI_GIAOHANG,
        { id: savedAddress.id },
        { laDiaChiMacDinh: true }
      );
      
      savedAddress.laDiaChiMacDinh = true;
    }

    await queryRunner.commitTransaction();

    // Lấy địa chỉ với relations
    return await getDiaChiGiaoHangById(savedAddress.id);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

// Cập nhật địa chỉ giao hàng theo ID
export const updateDiaChiGiaoHang = async (id: number, data: Partial<DIACHI_GIAOHANG>) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const diaChi = await repo.findOne({ where: { id } });
    if (!diaChi) {
      return null;
    }

    // Nếu đang đặt làm địa chỉ mặc định, hủy tất cả địa chỉ mặc định khác
    if (data.laDiaChiMacDinh) {
      await queryRunner.manager.update(
        DIACHI_GIAOHANG,
        { maNguoiDung: diaChi.maNguoiDung, laDiaChiMacDinh: true },
        { laDiaChiMacDinh: false }
      );
    }

    // Cập nhật thông tin
    await queryRunner.manager.update(DIACHI_GIAOHANG, id, {
      ...data,
      ngayCapNhat: new Date(),
    });

    await queryRunner.commitTransaction();

    // Lấy địa chỉ đã cập nhật
    return await getDiaChiGiaoHangById(id);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

// Xóa địa chỉ giao hàng theo ID
export const deleteDiaChiGiaoHang = async (id: number) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const diaChi = await repo.findOne({ where: { id } });
    if (!diaChi) {
      return { affected: 0 };
    }

    // Xóa địa chỉ
    const result = await queryRunner.manager.delete(DIACHI_GIAOHANG, id);

    // Nếu xóa địa chỉ mặc định, đặt địa chỉ khác làm mặc định nếu có
    if (diaChi.laDiaChiMacDinh) {
      const anotherAddress = await queryRunner.manager.findOne(DIACHI_GIAOHANG, {
        where: { maNguoiDung: diaChi.maNguoiDung },
        order: { ngayTao: 'DESC' },
      });

      if (anotherAddress) {
        await queryRunner.manager.update(
          DIACHI_GIAOHANG,
          { id: anotherAddress.id },
          { laDiaChiMacDinh: true }
        );
      }
    }

    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

// Đặt địa chỉ làm mặc định
export const setDiaChiMacDinh = async (id: number, maNguoiDung: number) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Kiểm tra xem địa chỉ có tồn tại không
    const diaChi = await repo.findOne({
      where: { id, maNguoiDung },
    });

    if (!diaChi) {
      throw new Error('Địa chỉ không tồn tại hoặc không thuộc về người dùng này');
    }

    // Hủy tất cả địa chỉ mặc định khác
    await queryRunner.manager.update(
      DIACHI_GIAOHANG,
      { maNguoiDung, laDiaChiMacDinh: true },
      { laDiaChiMacDinh: false }
    );

    // Đặt địa chỉ hiện tại làm mặc định
    await queryRunner.manager.update(
      DIACHI_GIAOHANG,
      { id },
      { laDiaChiMacDinh: true }
    );

    await queryRunner.commitTransaction();
    return true;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};