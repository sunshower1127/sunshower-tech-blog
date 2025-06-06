import { Combobox } from "./combobox";
import Tag from "./tag";

export default function TagSelector({
  tagList,
  tags,
  setTags,
}: {
  tagList: string[];
  tags: Set<string>;
  setTags: (updater: (draft: Set<string>) => void) => void;
}) {
  return (
    <div className="border flex flex-row gap-2 w-full">
      <Combobox
        tagList={tagList}
        tags={tags}
        addTag={(tag: string) => {
          setTags((draft) => {
            draft.add(tag);
          });
        }}
      />
      <ol
        className="flex flex-row gap-1 flex-wrap"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.getAttribute("data-name")) {
            const tagName = target.getAttribute("data-name");
            if (tagName) {
              setTags((draft) => {
                draft.delete(tagName);
              });
            }
          }
        }}
      >
        {[...tags].map((tag) => (
          <Tag key={tag} name={tag} />
        ))}
      </ol>
    </div>
  );
}
