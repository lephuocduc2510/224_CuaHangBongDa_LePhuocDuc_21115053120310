import { AppDataSource } from '../data-source';
import { PHUONGTIENSANPHAM } from '../entities/phuongTienSanPham.entity';
import { SANPHAM } from '../entities/sanPham.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const phuongTienRepo = AppDataSource.getRepository(PHUONGTIENSANPHAM);
const sanPhamRepo = AppDataSource.getRepository(SANPHAM);

// Helper function để tính toán hash của file
const calculateFileHash = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

// Kiểm tra ảnh trùng lặp
const isDuplicateImage = async (filePath: string, maSanPham: number): Promise<boolean> => {
  try {
    // Tính hash của file mới
    const newFileHash = await calculateFileHash(filePath);
    
    // Lấy danh sách phương tiện của sản phẩm
    const existingMedia = await phuongTienRepo.find({ where: { maSanPham } });
    
    // Kiểm tra từng file hiện có
    for (const media of existingMedia) {
      const existingFilePath = path.join(__dirname, '..', 'public', media.duongDan);
      
      // Kiểm tra file tồn tại
      if (fs.existsSync(existingFilePath)) {
        const existingFileHash = await calculateFileHash(existingFilePath);
        
        // So sánh hash
        if (newFileHash === existingFileHash) {
          return true; // Trùng lặp
        }
      }
    }
    
    return false; // Không trùng lặp
  } catch (error) {
    console.error('Lỗi khi kiểm tra ảnh trùng lặp:', error);
    return false; // Mặc định không coi là trùng lặp nếu có lỗi
  }
};

// Lấy tất cả phương tiện của một sản phẩm
export const getPhuongTienBySanPham = async (maSanPham: number) => {
  return await phuongTienRepo.find({
    where: { maSanPham },
    order: { laPhuongTienChinh: 'DESC' }
  });
};

// Thêm phương tiện cho sản phẩm
export const addPhuongTien = async (maSanPham: number, data: any, file: Express.Multer.File) => {
  // Kiểm tra sản phẩm tồn tại
  const sanPham = await sanPhamRepo.findOne({ where: { id: maSanPham } });
  if (!sanPham) {
    throw new Error('Sản phẩm không tồn tại');
  }

  // Đường dẫn đầy đủ tới file vừa upload
  const fullFilePath = file.path;
  const relativePath = `/uploads/${maSanPham}/${file.filename}`;
  
  // Kiểm tra trùng lặp
  const isDuplicate = await isDuplicateImage(fullFilePath, maSanPham);
  if (isDuplicate) {
    // Xóa file trùng lặp
    fs.unlinkSync(fullFilePath);
    throw new Error('Ảnh này đã tồn tại cho sản phẩm');
  }

  // Kiểm tra xem có đánh dấu là phương tiện chính không
  if (data.laPhuongTienChinh === true || data.laPhuongTienChinh === 'true') {
    // Nếu đây là phương tiện chính, hủy đánh dấu phương tiện chính cũ (nếu có)
    await phuongTienRepo.update(
      { maSanPham, laPhuongTienChinh: true },
      { laPhuongTienChinh: false }
    );
  }

  // Tạo đối tượng phương tiện mới
  const phuongTien = phuongTienRepo.create({
    maSanPham,
    tenPhuongTien: data.tenPhuongTien || file.originalname,
    duongDan: relativePath,
    loaiPhuongTien: data.loaiPhuongTien || 
      (file.mimetype.startsWith('image/') ? 'image' : 'video'),
    laPhuongTienChinh: data.laPhuongTienChinh === true || data.laPhuongTienChinh === 'true'
  });

  // Lưu vào database
  return await phuongTienRepo.save(phuongTien);
};

// Thêm nhiều phương tiện cho sản phẩm
export const addMultiplePhuongTien = async (maSanPham: number, data: any, files: Express.Multer.File[]) => {
  // Kiểm tra sản phẩm tồn tại
  const sanPham = await sanPhamRepo.findOne({ where: { id: maSanPham } });
  if (!sanPham) {
    throw new Error('Sản phẩm không tồn tại');
  }

  // Nếu người dùng chọn một phương tiện làm chính
  let mainMediaIndex = -1;
  if (data.mainIndex !== undefined) {
    mainMediaIndex = parseInt(data.mainIndex);
    
    // Kiểm tra index hợp lệ
    if (mainMediaIndex < 0 || mainMediaIndex >= files.length) {
      throw new Error('Index của phương tiện chính không hợp lệ');
    }
    
    // Hủy đánh dấu phương tiện chính cũ (nếu có)
    await phuongTienRepo.update(
      { maSanPham, laPhuongTienChinh: true },
      { laPhuongTienChinh: false }
    );
  }
  
  // Mảng lưu các file không trùng lặp
  const uniqueFiles: Express.Multer.File[] = [];
  const duplicateFiles: Express.Multer.File[] = [];
  
  // Kiểm tra trùng lặp cho từng file
  for (const file of files) {
    const fullFilePath = file.path;
    const isDuplicate = await isDuplicateImage(fullFilePath, maSanPham);
    
    if (isDuplicate) {
      // Thêm vào danh sách trùng lặp để xóa sau
      duplicateFiles.push(file);
    } else {
      // Thêm vào danh sách không trùng lặp
      uniqueFiles.push(file);
    }
  }
  
  // Xóa các file trùng lặp
  for (const file of duplicateFiles) {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error(`Không thể xóa file ${file.path}:`, error);
    }
  }
  
  // Điều chỉnh lại mainMediaIndex nếu cần
  if (mainMediaIndex >= 0) {
    // Tìm vị trí mới của file chính sau khi lọc file trùng lặp
    const mainFile = files[mainMediaIndex];
    mainMediaIndex = uniqueFiles.findIndex(file => file.filename === mainFile.filename);
    if (mainMediaIndex === -1) {
      // Nếu file được chọn làm chính bị trùng lặp và bị xóa
      mainMediaIndex = 0; // Chọn file đầu tiên làm chính nếu còn file nào đó
    }
  }
  
  // Tạo mảng các đối tượng phương tiện từ file không trùng lặp
  const phuongTienList = uniqueFiles.map((file, index) => {
    const isMain = index === mainMediaIndex;
    return phuongTienRepo.create({
      maSanPham,
      tenPhuongTien: data.tenPhuongTien ? 
        `${data.tenPhuongTien} ${index + 1}` : 
        file.originalname,
      duongDan: `http://localhost:9000/uploads/${maSanPham}/${file.filename}`,
      loaiPhuongTien: file.mimetype.startsWith('image/') ? 'image' : 'video',
      laPhuongTienChinh: isMain
    });
  });
  
  // Lưu tất cả vào database
  if (phuongTienList.length === 0) {
    return { 
      saved: [],
      duplicates: duplicateFiles.length,
      message: 'Tất cả ảnh đều trùng lặp, không có ảnh nào được lưu' 
    };
  }
  
  const savedMedia = await phuongTienRepo.save(phuongTienList);
  
  return {
    saved: savedMedia,
    duplicates: duplicateFiles.length,
    message: duplicateFiles.length > 0 ? 
      `Đã lưu ${savedMedia.length} ảnh, bỏ qua ${duplicateFiles.length} ảnh trùng lặp` : 
      `Đã lưu ${savedMedia.length} ảnh`
  };
};

// Cập nhật phương tiện
export const updatePhuongTien = async (id: number, data: any) => {
  const phuongTien = await phuongTienRepo.findOne({ where: { id } });
  if (!phuongTien) {
    throw new Error('Phương tiện không tồn tại');
  }

  // Kiểm tra xem có đánh dấu là phương tiện chính không
  if ((data.laPhuongTienChinh === true || data.laPhuongTienChinh === 'true') && !phuongTien.laPhuongTienChinh) {
    // Nếu đây là phương tiện chính mới, hủy đánh dấu phương tiện chính cũ
    await phuongTienRepo.update(
      { maSanPham: phuongTien.maSanPham, laPhuongTienChinh: true },
      { laPhuongTienChinh: false }
    );
  }

  // Cập nhật thông tin
  await phuongTienRepo.update(id, {
    tenPhuongTien: data.tenPhuongTien || phuongTien.tenPhuongTien,
    loaiPhuongTien: data.loaiPhuongTien || phuongTien.loaiPhuongTien,
    laPhuongTienChinh: data.laPhuongTienChinh === true || data.laPhuongTienChinh === 'true'
  });

  return await phuongTienRepo.findOne({ where: { id } });
};

// Xóa phương tiện
export const deletePhuongTien = async (id: number) => {
  const phuongTien = await phuongTienRepo.findOne({ where: { id } });
  if (!phuongTien) {
    throw new Error('Phương tiện không tồn tại');
  }

  // Xóa file từ máy chủ
  const filePath = path.join(__dirname, '..', 'public', phuongTien.duongDan);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Kiểm tra và xóa thư mục nếu rỗng
      const dirPath = path.dirname(filePath);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        if (files.length === 0) {
          fs.rmdirSync(dirPath);
        }
      }
    }
  } catch (error) {
    console.error('Không thể xóa file:', error);
  }

  // Xóa từ database
  return await phuongTienRepo.delete(id);
};

// Đặt phương tiện chính
export const setPhuongTienChinh = async (id: number) => {
  const phuongTien = await phuongTienRepo.findOne({ where: { id } });
  if (!phuongTien) {
    throw new Error('Phương tiện không tồn tại');
  }

  // Hủy đánh dấu phương tiện chính cũ
  await phuongTienRepo.update(
    { maSanPham: phuongTien.maSanPham, laPhuongTienChinh: true },
    { laPhuongTienChinh: false }
  );

  // Đặt phương tiện hiện tại làm chính
  await phuongTienRepo.update(id, { laPhuongTienChinh: true });

  return await phuongTienRepo.findOne({ where: { id } });
};

// Lấy phương tiện chính của sản phẩm
export const getMainPhuongTien = async (maSanPham: number) => {
  return await phuongTienRepo.findOne({ 
    where: { 
      maSanPham, 
      laPhuongTienChinh: true 
    } 
  });
};

// Lấy phương tiện theo ID
export const getPhuongTienById = async (id: number) => {
  const phuongTien = await phuongTienRepo.findOne({ where: { id } });
  if (!phuongTien) {
    throw new Error('Phương tiện không tồn tại');
  }
  return phuongTien;
};

// Lấy tổng số phương tiện của sản phẩm
export const countPhuongTienBySanPham = async (maSanPham: number) => {
  return await phuongTienRepo.count({ where: { maSanPham } });
};

// Xóa tất cả phương tiện của sản phẩm
export const deleteAllPhuongTienBySanPham = async (maSanPham: number) => {
  const phuongTiens = await phuongTienRepo.find({ where: { maSanPham } });
  
  // Xóa từng file
  for (const phuongTien of phuongTiens) {
    const filePath = path.join(__dirname, '..', 'public', phuongTien.duongDan);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Không thể xóa file ${filePath}:`, error);
    }
  }
  
  // Xóa thư mục sản phẩm nếu tồn tại
  const dirPath = path.join(__dirname, '..', 'public', 'uploads', maSanPham.toString());
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Không thể xóa thư mục ${dirPath}:`, error);
  }
  
  // Xóa tất cả bản ghi trong database
  await phuongTienRepo.delete({ maSanPham });
  
  return { message: `Đã xóa ${phuongTiens.length} phương tiện của sản phẩm ${maSanPham}` };
};