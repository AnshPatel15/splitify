type GroupCardProps = {
  group: Group;
  onClick: () => void;
};

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="text-amber-50 bg-[#27548A] flex rounded-md p-3 flex-col shadow-2xl hover:shadow-xl cursor-pointer hover:translate-y-[-5px] transition-all duration-300 ease-out border-l-[3px] border-r-[3px] border-[#4895ff]"
    >
      <div className="capitalize flex flex-col">
        <span className="text-lg">{group.name}</span>
      </div>
      <div className="capitalize flex flex-col mt-1">
        <span className="text-[#a3a5ae] text-sm">{group.description}</span>
      </div>
    </div>
  );
};

export default GroupCard;
