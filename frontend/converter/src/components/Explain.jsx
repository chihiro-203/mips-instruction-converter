import React from 'react'

const Explain = ({ searchResults }) => {
  return (
    <div>
        {searchResults.length > 0 ? (
        searchResults.map((item, index) => (
          <div key={index}>
            <p>{item.name1}</p>
            <p>{item.name2}</p>
          </div>
        ))
      ) : (
        <p>No results found.</p>)}
    </div>
  )
}

export default Explain