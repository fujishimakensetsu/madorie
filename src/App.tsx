import { useUIStore } from './stores/useUIStore';
import { LandingPage } from './components/templates/LandingPage';
import { ChooseScreen } from './components/templates/ChooseScreen';
import { TemplateSelector } from './components/templates/TemplateSelector';
import { BlankFloorsScreen } from './components/templates/BlankFloorsScreen';
import { EditorScreen } from './components/EditorScreen';

function App() {
  const screen = useUIStore((s) => s.screen);

  return (
    <>
      {screen === 'landing' && <LandingPage />}
      {screen === 'choose' && <ChooseScreen />}
      {screen === 'template' && <TemplateSelector />}
      {screen === 'blank-floors' && <BlankFloorsScreen />}
      {screen === 'editor' && <EditorScreen />}
    </>
  );
}

export default App;
