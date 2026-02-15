import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage, ColorTheoryPage, ReferenceSearchPage, LightReferencePage } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="color" element={<ColorTheoryPage />} />
        <Route path="reference" element={<ReferenceSearchPage />} />
        <Route path="light" element={<LightReferencePage />} />
      </Route>
    </Routes>
  );
}

export default App;
