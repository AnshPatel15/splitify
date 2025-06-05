const GroupSettings = ({ group }: { group: Group | null }) => (
  <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-[90%] md:w-[500px] mx-auto mt-4">
    <h2 className="text-lg font-semibold mb-2">Group Settings</h2>
    <p className="text-sm text-gray-700">
      Here you can manage your group settings.
    </p>
    <div className="mt-4">
      <h2>Members: </h2>
      <ul className="list-disc pl-5">
        {group?.members?.map((member) => (
          <li key={member.id} className="text-sm text-gray-700">
            {member.user.name}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default GroupSettings;
