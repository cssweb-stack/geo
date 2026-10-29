# Faculty directory and profiles

## What to edit

- Shared details: `src/_data/faculty.json`.
- Long-form right-column content: `src/_includes/faculty/<slug>.html`.
- Directory template: `src/faculty/index.html`.
- Profile template: `src/faculty/profile.njk`.
- Shared phone, email, and location markup: `src/_includes/components/faculty-contact.njk`.
- Styles: the `Core faculty directory and profiles` section of `src/geo.css`.

For example, edit `src/_includes/faculty/qi-chen.html` to change Qi Chen's Background, Education, Courses, or Research. These files are ordinary HTML. They contain no JSON and need no front matter. Add, remove, or reorder headings, paragraphs, and lists directly.

Each JSON record generates `/faculty/<slug>.html` automatically. The matching HTML filename must use that same slug. The faculty name is the page's single H1, below the photo. The shared base layout suppresses its usual title only on these profile pages.

## Short fields in JSON

- `title`: academic title, such as Professor.
- `role`: optional administrative role, such as Graduate Chair. Use `""` when absent; the entire line disappears.
- `office`, `phone`, and `email`: omitted from the page when empty.
- `phoneHref`: international dialing value, such as `+18089563524`, paired with the display value in `phone`.
- `photo`, `photoWidth`, and `photoHeight`: source path and actual image dimensions. Existing 400px and 600px square images use the same display treatment.
- `keywords`: list of short research topics.
- `links`: optional list of `{ "label": "Website", "url": "https://example.org/" }` objects. Keep this as `[]` when absent.
- `publications`: optional list of link objects with `label`, `url`, and `image`. The whole section, including its heading and divider, disappears when this list is empty.

Use an existing publication entry as a model. The four shared logos remain in `src/_media/publications/`. Adding another platform means adding its logo there and another object to the person's `publications` list. No template change is needed.

## Awards

Awards are ordinary HTML in the biography, after Courses and before Research. The original award badge is not used. Award names and years are preserved; the awarding university or college is written explicitly. Only faculty with listed awards have an Awards section.

## Source decisions and items for department review

Migrated October 28, 2026 from https://geography.manoa.hawaii.edu/faculty/ and the ten current core-faculty profiles linked there. Older profiles found only in the site's navigation were not added to the core roster. Existing associated-faculty and contact pages were not changed.

1. **Qi Chen's location:** the directory says Saunders 435, 445B; the individual profile says Saunders 435. The shared record uses the directory's fuller value on both pages.
2. **Brian Szuster's administrative role:** his Research paragraph says he is Undergraduate Chair, while the current directory identifies Hong Jiang as Undergraduate Chair. Shared role fields follow the directory. The older sentence remains in Brian's HTML for department review.
3. **Aurora Kagawa-Viviani's commission service:** the existing biography describes service on the Hawaiʻi Commission on Water Resource Management with dates 2021–2025. This text is preserved; confirm whether its present-tense wording needs updating.
4. **Course titles and other time-sensitive claims:** existing biography copy, education, course lists, research statements, and embedded links were preserved rather than updated editorially. Some titles differ from other department pages; confirm changes with the department.
5. **Unused photos:** David Olsen and Elizabeth Tajima images are in the supplied media folder but are not among the ten core faculty listed on the source directory. They are left untouched for later work.

The only publication URL cleanup was removal of an encoded trailing space from Mary Mostafanezhad's Google Scholar link.

## Layout and checks

- Directory: three columns at desktop widths, two on tablet, one on narrow screens.
- Profiles: two columns at 992px and above; sidebar followed by biography below that width.
- Directory photos: 212px squares. Profile photos: up to 22rem, constrained by their column.
- The directory photo and name share one link and one keyboard tab stop.
- Phone links use `tel:`. Contact icons are decorative; hidden text supplies their purpose for screen readers.
- Publication links have person-specific alternative text. Links stay in the same tab.
- Profile biography H2 spacing is 1.5rem, matching the chosen `mt-4` spacing.

Run `npm run build` after edits, or `npm run dev` for the normal local preview.
