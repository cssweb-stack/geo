export default {
  eleventyComputed: {
    person: data => data.personSlug ? data.faculty.find(person => person.slug === data.personSlug) : undefined
  }
};
