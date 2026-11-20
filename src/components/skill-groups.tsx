import { skills } from "@/content/skills";
import { TagList } from "./tag-list";

export function SkillGroups() {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((group) => (
        <div key={group.name}>
          <h3 className="mb-3 font-semibold tracking-tight">{group.name}</h3>
          <TagList items={group.skills} />
        </div>
      ))}
    </div>
  );
}
