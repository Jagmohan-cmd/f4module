import React, { useState } from 'react';
import axios from 'axios';
import "./pincode.css";

function Pincode() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postalData, setPostalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setError('Postal code must be 6 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;
      if (data[0].Status === 'Success') {
        setPostalData(data[0].PostOffice);
        setFilteredData(data[0].PostOffice);
      } else {
        setError('Error fetching data');
      }
    } catch (error) {
      setError('Error fetching data');
    }
    // setLoading(false);
  };

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = postalData.filter((item) =>
      item.Name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    if (filtered.length === 0) {
      setError("Couldn't find the postal data you're looking for…");
    } else {
      setError('');
    }
  };

  return (
    
    <div>
        {!loading && <div>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Enter Pincode</h1>
        <input
        className='form-input'
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button type="submit">Lookup</button>
      </form>
      </div>}
      {loading && <div className='filter-box'>
        <h2>Pincode: {pincode}</h2>
      <h2>Message: <span>Number of pincode(s) found: {filteredData.length}</span></h2>
      <input
        type="text"
        placeholder="Filter"
        onChange={handleFilter}
      />
      <div className='filter-container'>
        {filteredData.map((item, index) => (
          <div className='filter-card' key={index}>
            <p>Post Office Name: {item.Name}</p>
            <p>Branch Type: {item.BranchType}</p>
            <p>District: {item.District}</p>
            <p>State: {item.State}</p>
          </div>
        ))}
      </div>
        </div>}
      {error && <div>{error}</div>}
      
    </div>
  );
}

export default Pincode;
