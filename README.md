# Dr. Alexis Jon - Cardiologist Profile

A modern, responsive website for Dr. Alexis Jon's cardiology practice featuring a professional profile, services, and patient information.

## Features

- 🏥 Professional doctor profile with credentials
- 📊 Animated statistics dashboard
- 🩺 Medical specialties and services
- ⭐ Patient reviews and testimonials
- 📱 Fully responsive design
- ⚡ Fast loading with optimized performance
- 🎨 Modern UI with smooth animations

## Technologies Used

- React 19.1.1
- Webpack 5
- CSS3 with animations
- Font Awesome icons
- Cloudinary image hosting

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the build settings

### Build Settings for Vercel

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Project Structure

```
DrProfile/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── DoctorProfile.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── dist/ (generated)
├── package.json
├── webpack.config.js
├── vercel.json
└── README.md
```

## Customization

- **Doctor Information:** Edit `src/components/DoctorProfile.js`
- **Styling:** Modify `src/styles.css`
- **Images:** Update Cloudinary URLs in the component
- **Content:** Update text, services, and reviews as needed

## Performance Optimizations

- ✅ Code splitting and lazy loading
- ✅ Image optimization via Cloudinary
- ✅ Minified CSS and JavaScript
- ✅ Optimized bundle size
- ✅ Fast loading animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC License

---

**Contact:** For any questions about this project, please contact the development team.
