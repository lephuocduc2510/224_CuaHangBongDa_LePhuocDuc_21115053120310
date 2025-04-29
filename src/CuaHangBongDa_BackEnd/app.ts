import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import adminSanPhamRoute from './routes/admin/sanPham.route';
import adminDanhmucRoute from './routes/admin/danhMuc.routes';
import adminVaitroRoute from './routes/admin/vaiTro.routes';
import { AppDataSource } from './data-source';
import adminNguoiDungRoute from './routes/admin/nguoiDung.route';
import adminNhaCungCapRoute from './routes/admin/nhaCungCap.route';
import adminNhaSanXuatRoute from './routes/admin/nhaSanXuat.route';
import adminDonHangRoute from './routes/admin/donHang.route';
import adminPhieuGiamGiaRoute from './routes/admin/phieuGiamGia.route';
import adminMauSacRoute from './routes/admin/mauSac.route';
import adminKichCoRoute from './routes/admin/kichCo.route';
// import indexRouter from './routes/index';
// import categoriesRouter from './routes/categories';
// import suppliersRouter from './routes/suppliers';
// import productsRouter from './routes/products';
// import ordersRouter from './routes/orders';
// import advancedRouter from './routes/advanced';

const app: Express = express();

AppDataSource.initialize().then(async () => {
  console.log('Data source was initialized');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // use cors
  app.use(cors({ origin: '*' }));

  app.use('/api/admin/sanpham', adminSanPhamRoute);
  app.use('/api/admin/danhmuc', adminDanhmucRoute);
  app.use('/api/admin/vaitro', adminVaitroRoute);
  app.use('/api/admin/nguoidung', adminNguoiDungRoute);
  app.use('/api/admin/nhacungcap', adminNhaCungCapRoute);
  app.use('/api/admin/nhasanxuat', adminNhaSanXuatRoute);
  app.use('/api/admin/donhang', adminDonHangRoute);
  app.use('/api/admin/phieugiamgia', adminPhieuGiamGiaRoute);
  app.use('/api/admin/mausac', adminMauSacRoute);
  app.use('/api/admin/kichco', adminKichCoRoute);

  // app.use('/', indexRouter);
  // app.use('/categories', categoriesRouter);
  // app.use('/products', productsRouter);
  // app.use('/suppliers', suppliersRouter);
  // app.use('/orders', ordersRouter);
  // app.use('/advanced', advancedRouter);

  // catch 404 and forward to error handler
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send('Not found');
    // next(createError(404));
  });

  // error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

export default app;
