import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "../redux/async/dataSlice";
import { useNavigate, useLocation } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const InputStock = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isUpdate } = useSelector((state) => state.products);

  const location = useLocation();
  const { state } = location; // Mengambil state dari navigasi

  const [input, setInput] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    stock: 0,
  });

  useEffect(() => {
    if (state && state.product) {
      setInput(state.product);
    }
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      input.name.trim() !== "" ||
      input.description.trim() !== "" ||
      input.price.trim() !== "" ||
      input.stock.trim() >= 0
    ) {
      if (isUpdate) {
        dispatch(updateData(input));
      } else {
        dispatch(addData(input));
      }
      setInput({
        name: "",
        description: "",
        price: "",
        stock: 0,
      });
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Jika field adalah stock, konversi value ke number
    if (name === "stock") {
      setInput({ ...input, [name]: Number(value) });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>back</button>
      {!isUpdate && (
        <div className="scan-container">
          <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={(err, result) => {
              if (result) {
                setInput({ ...input, id: result.text });
              } 
            }}
          />
        </div>
      )}
      <h2>{isUpdate ? "Edit Stock" : "Input Stock"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input type="text" name="id" id="id" value={input.id} disabled={isUpdate} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={input.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            id="description"
            value={input.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            id="price"
            value={input.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={input.stock}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {isUpdate ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default InputStock;
