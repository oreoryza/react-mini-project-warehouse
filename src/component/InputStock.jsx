import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "../redux/async/dataSlice";
import { useNavigate, useLocation } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Report } from "notiflix/build/notiflix-report-aio";

const InputStock = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isUpdate } = useSelector((state) => state.products);

  const { lang } = useSelector((state) => state.lang);

  const location = useLocation();
  const { state } = location; // Mengambil state dari navigasi

  const [input, setInput] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    stock: 0,
  });

  const [scannerSize, setScannerSize] = useState({ width: 500, height: 500 });

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

  const handleResize = () => {
    if (window.innerWidth < 425) {
      setScannerSize({ width: 275, height: 275 });
    } else if (window.innerWidth < 768) {
      setScannerSize({ width: 300, height: 300 });
    } else {
      setScannerSize({ width: 500, height: 500 });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="btn-back-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i class="bi bi-chevron-left"></i>{" "}
          {lang === "en" ? "Back" : "Kembali"}
        </button>
      </div>
      {!isUpdate && (
        <div className="scan-container">
          <div className="scan-box"></div>
          <BarcodeScannerComponent
            width={scannerSize.width}
            height={scannerSize.height}
            onUpdate={(err, result) => {
              if (result) {
                setInput({ ...input, id: result.text });
                Report.success("Scan Success", `Product ID: ${result.text}`);
              }
            }}
          />
        </div>
      )}
      <h2>
        {isUpdate
          ? `${lang === "en" ? "Update Product" : "Perbarui Produk"}`
          : `${lang === "en" ? "Input Product" : "Masukkan Produk"}`}
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            name="id"
            id="id"
            value={input.id}
            disabled={isUpdate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">
            {lang === "en" ? "Product Name:" : "Nama Produk:"}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={input.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">
            {lang === "en" ? "Description:" : "Deskripsi:"}
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={input.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">{lang === "en" ? "Price:" : "Harga:"}</label>
          <input
            type="number"
            name="price"
            id="price"
            min={0}
            value={input.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="stock">{lang === "en" ? "Stock:" : "Stok"}</label>
          <input
            type="number"
            name="stock"
            id="stock"
            min={1}
            value={input.stock}
            onChange={handleChange}
          />
        </div>
        <div className="btn-submit">
          <button type="submit" disabled={loading}>
            {isUpdate
              ? `${lang === "en" ? "Update" : "Perbarui"}`
              : `${lang === "en" ? "Submit" : "Kirim"}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputStock;
