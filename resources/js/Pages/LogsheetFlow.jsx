const [activeModal, setActiveModal] = useState(null); 
const [savedSetupData, setSavedSetupData] = useState(null);

{activeModal === "setup" && (
  <SetupChecklist
    formData={formData}
    setFormData={setFormData}
    onNext={(savedData) => {
      setSavedSetupData(savedData); // save setup checklist values
      setActiveModal("positive");
    }}
  />
)}

{activeModal === "positive" && savedSetupData && (
  <PositiveChecklist
    setupData={savedSetupData}  // auto-fill from setup
    onBack={() => setActiveModal("setup")}
  />
)}
