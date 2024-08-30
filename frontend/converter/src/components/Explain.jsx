import React from 'react'

const Explain = ({ searchResults }) => {
  return (
    <div>
      {searchResults && searchResults.explain ? (
        <div dangerouslySetInnerHTML={{ __html: searchResults.explain }} />
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}

export default Explain;
