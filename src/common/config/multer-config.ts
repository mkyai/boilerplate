import { diskStorage } from 'multer';
import {
  imageKeyNormalize,
} from 'src/common/helpers/app.helper';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null,' getStoragePath(req, file.mimetype)');
    },
    filename: (req, file, cb) => {
      cb(null, imageKeyNormalize(file.originalname));
    },
  }),
};
