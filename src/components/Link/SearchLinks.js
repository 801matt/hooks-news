import React from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const { firebase } = React.useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = React.useState([]);
  const [links, setLinks] = React.useState([]);

  React.useEffect(() => {
    getInitialLinks();
  }, []);

  function getInitialLinks() {
    firebase.db
      .collection("links")
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
  }

  function handleSearch(e) {
    e.preventDefault();
    const filter = e.target.value;
    const query = filter.toLowerCase();
    if (filter !== "" && filter !== " ") {
      const matchedLinks = links.filter(link => {
        return (
          link.description.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query) ||
          link.postedBy.name.toLowerCase().includes(query)
        );
      });
      setFilteredLinks(matchedLinks);
    }
    if (filter === "") {
      setFilteredLinks([]);
    }
  }
  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={handleSearch} />
          <button>OK</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
