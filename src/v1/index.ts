import * as express from 'express';
import * as multer from 'multer';
import * as sharp from 'sharp';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

const router = express.Router();

router.get('/', (_, res) => {
  return res.json({ status: 'ok' });
});

router.post('/jpg', upload.single('image'), async (req, res, next) => {
  try {
    await sharp(req.file.buffer)
      .resize({
        width: 1500,
        height: 1500,
        fit: 'cover',
        withoutEnlargement: true,
      })
      .jpeg({ chromaSubsampling: '4:4:4', quality: 75 })
      .toFile(`./public/images/original.jpg`);

    return res.json({ error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.post('/png', upload.single('image'), async (req, res, next) => {
  const { size } = req.body;
  try {
    await sharp(req.file.buffer)
      .resize({
        width: Number(size),
        height: Number(size),
        fit: 'cover',
        withoutEnlargement: true,
      })
      .png({ quality: 75 })
      .toFile(`./public/images/icon-${size}x${size}.png`);

    return res.json({ error: 0 });
  } catch (err) {
    return next(err);
  }
});

export default router;
