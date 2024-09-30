type SectionHeadingProps = {
  icon: JSX.Element;
  label: string;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-x-2">
      <div className="h-4 w-4 md:h-10 md:w-10 rounded-md flex items-center justify-center text-purple-700 bg-purple-100 p-2">{icon}</div>
      <span className="ml-2">{label}</span>
    </div>
  );
};

export default SectionHeading;
