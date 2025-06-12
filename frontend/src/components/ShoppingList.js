import { useEffect, useState } from 'react';
import axios from 'axios';

const ShoppingList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get('/api/mealplan/shopping-list').then(res => setList(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Shopping List</h2>
      <ul>
        {list.map((item, i) => (
          <li key={i} className="mb-2">
            <strong>{item.name}</strong>: {item.quantities.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
