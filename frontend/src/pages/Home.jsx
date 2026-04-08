import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import { useAuth } from "../context/useAuth";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Home loads a short featured list so the landing page feels alive
    // without forcing the user to open the full menu first.
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await api.get("/products", {
          params: { available: true },
        });

        setFeaturedProducts((response.data.data?.products || []).slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="home">
      <Navbar />

      {/* Hero section changes CTA based on auth state to avoid showing
          "Create Account" to an already logged-in user. */}
      <section className="hero-home">
        <div className="container hero-home-grid">
          <div className="hero-home-copy">
            <p className="section-kicker">Trải nghiệm đặt pizza</p>
            <h1 style={{ fontSize: 50 }}>Pizza ngon giao hàng nhanh chóng</h1>
            <p>
              Nguyên liệu tươi ngon, topping tuyển chọn, cùng quy trình đặt hàng
              mượt mà từ menu đến thanh toán.
            </p>

            {isAuthenticated ? (
              <div className="hero-auth-card">
                <strong>Chào Mừng bạn , {user.name}</strong>
                <span>
                  Chào mừng bạn đến với PizzaHub – nơi hội tụ những chiếc pizza
                  nóng hổi và ngon khó cưỡng.
                </span>
              </div>
            ) : null}

            <div className="hero-home-actions">
              <Link to="/menu">
                <Button variant="primary" size="large">
                  Đặt Hàng Ngay
                </Button>
              </Link>

              {!isAuthenticated && (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="large">
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="large">
                      Đăng Ký
                    </Button>
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <Button variant="secondary" size="large" onClick={handleLogout}>
                  Đăng Xuất
                </Button>
              )}
            </div>
          </div>

          <div className="hero-home-visual">
            <div className="hero-card">
              <img src="/pizzademo.png" alt="Fresh pizza on a board" />
              <div className="hero-card-badge">
                {/* <strong>Freshly baked every day</strong>
                <span>Search, order, and checkout with a cleaner storefront experience.</span> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products reuse ProductCard so the home page and menu page
          stay visually and behaviorally consistent. */}
      <section className="home-featured">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Sản phẩm nổi bật</p>
            <h2>Được chọn nhiều nhất – thử là ghiền.</h2>
          </div>

          {loadingProducts ? (
            <div className="home-state-card">
              Đang tải các loại pizza nổi bật...
            </div>
          ) : (
            <div className="home-featured-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout="stacked"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us gives the landing page stronger marketing content
          instead of feeling like only a technical demo. */}
      <section className="home-why">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Tại sao nên chọn chúng tôi ?</p>
            <h2>Pizza tươi mỗi ngày – giao nhanh, ăn là mê</h2>
          </div>

          <div className="why-grid">
            <article className="why-card">
              <div className="why-icon">
                <img src="/nguyenlieupizza.jpg" alt="Nguyên liệu tươi" />
              </div>

              <h3>Nguyên liệu tươi</h3>
              <p>
                Từng nguyên liệu được chuẩn bị mỗi ngày, mang đến chiếc pizza
                nóng hổi và đậm vị.
              </p>
            </article>
            <article className="why-card">
              <div className="why-icon">
                <img src="/giaohang.jpeg" alt="Giao nhanh" />
              </div>
              <h3>Giao nhanh</h3>
              <p>
                Chỉ trong 30 phút, pizza nóng hổi sẽ có mặt tại cửa của bạn.
              </p>
            </article>
            <article className="why-card">
              <div className="why-icon">
                <img src="/pizzangon.png" alt="Hương vị tuyệt vời" />
              </div>
              <h3>Hương vị tuyệt vời</h3>
              <p>
                Công thức đặc biệt tạo nên hương vị khiến bạn muốn thưởng thức
                mãi.
              </p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
