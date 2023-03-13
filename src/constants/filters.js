export const FILTERS = ["ALL", "SUBMITTED", "NOT SUBMITTED"];

export const filterBySubmitted = topics => {
  return topics.filter(topic => topic.submitted);
};

export const filterByNotSubmitted = topics => {
  return topics.filter(topic => topic.submitted === false);
};
