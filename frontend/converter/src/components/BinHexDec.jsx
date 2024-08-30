import React from 'react'

const BinHexDec = ({ searchResults }) => {
  return (
    <div>
      {searchResults && searchResults.value ? (
        <div dangerouslySetInnerHTML={{ __html: searchResults.value }} />
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}

export default BinHexDec