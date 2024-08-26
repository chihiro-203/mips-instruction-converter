import React from 'react'

const Explain = ({ searchResults }) => {
  return (
    <div>
        {searchResults.length > 0 ? (
        <div dangerouslySetInnerHTML={{ __html: searchResults }} />
      ) : (
        <p>No results found.</p>)}
    </div>
  )
}

export default Explain