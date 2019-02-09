const Teams = {
  1: {
    id: "1",
    name: "Blackhawks",
    city: "Chicago",
    league: "NHL"
  },
  2: {
    id: "2",
    name: "Red Sox",
    city: "Boston",
    league: "MLB"
  }
};

let incrementalId = Object.keys(Teams).reduce((s, i) => s + Number(i), 0);

const DataStore = {
  getTeams: () => Teams,
  getTeam: id => Teams[id],
  addTeam: team => {
    const id = incrementalId++;
    const newTeam = { ...team, id };
    Teams[id] = newTeam;

    return newTeam;
  }
};

module.exports = { DataStore };
