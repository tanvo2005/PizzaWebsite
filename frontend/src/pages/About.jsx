import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero section: a brand-level introduction page replacing the old profile screen. */}
      {/* Giữ nguyên cấu trúc JSX để không làm vỡ layout sẵn có của trang About. */}
      <section
        className="about-hero"
        // Dùng ảnh URL để dễ thay thế sau này mà không cần chỉnh lại CSS hoặc assets trong repo.
        style={{
          backgroundImage: "url('/pizzademo1.jpg')",
        }}
      >
        <div className="container about-hero-content">
          <p className="section-kicker">Giới thiệu</p>
          <h1>Pizza chuẩn vị – Trải nghiệm trọn vẹn</h1>
          <p>
            Không chỉ là pizza, chúng tôi mang đến trải nghiệm ẩm thực trọn vẹn trong từng miếng bánh,
            từ nguyên liệu tươi mới đến cách phục vụ chỉnh chu để bạn luôn muốn quay lại.
          </p>
        </div>
      </section>

      {/* Story section explains founding and mission so the page feels like
          a real restaurant landing page, not a placeholder. */}
      <section className="about-story">
        <div className="container about-story-grid">
          <div className="about-story-copy">
            <p className="section-kicker">Câu chuyện</p>
            <h2>Từ một căn bếp nhỏ đến thương hiệu được tin tưởng</h2>
            <p>
              Chúng tôi bắt đầu từ một căn bếp nhỏ với mục tiêu duy nhất: làm pizza đúng vị.
              Mỗi ngày, đội ngũ tập trung hoàn thiện công thức bột, cân bằng vị sốt và canh lửa chuẩn,
              để chiếc pizza khi đến tay bạn vẫn giữ được độ nóng và hương thơm đặc trưng.
            </p>
            <p>
              Qua thời gian, sự tin yêu của khách hàng đã giúp chúng tôi phát triển,
              nhưng tinh thần ban đầu vẫn giữ nguyên: làm ra pizza ngon, dễ đặt, giao nhanh,
              và tạo cảm giác “đáng để quay lại” sau mỗi lần thưởng thức.
            </p>
          </div>

          {/* Cách thay ảnh sau này: chỉ cần đổi URL trong thuộc tính src/style là xong. */}
          <div className="about-story-visual">
            {/* Thay ảnh bằng URL giúp bạn đổi hình minh họa nhanh trong tương lai. */}
            <img
              src="/beplambanh.jpg"
              alt="Pizza story"
            />
          </div>
        </div>
      </section>

      {/* Ingredient cards use stylized visual blocks to communicate freshness
          without needing extra image assets in the repo. */}
      <section className="about-ingredients">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Nguyên liệu</p>
            <h2>Nguyên liệu tươi – Hương vị thật</h2>
          </div>

          <div className="ingredients-grid">
            <article className="ingredient-card">
              <div
                className="ingredient-media ingredient-cheese"
                style={{
                  backgroundImage: "url('/phomai.jpg')",
                }}
              />
              <h3>Phô mai</h3>
              <p>Phô mai béo mịn, kéo sợi đẹp, giúp hương vị đậm đà nhưng không ngấy.</p>
            </article>
            <article className="ingredient-card">
              <div
                className="ingredient-media ingredient-tomato"
                style={{
                  backgroundImage: "url('/cachua.jpg')",
                }}
              />
              <h3>Cà chua</h3>
              <p>Sốt cà chua chua ngọt vừa phải, tạo nền vị cân bằng cho mọi loại topping.</p>
            </article>
            <article className="ingredient-card">
              <div
                className="ingredient-media ingredient-dough"
                style={{
                  backgroundImage: "url('/debanh.jpg')",
                }}
              />
              <h3>Đế bánh</h3>
              <p>Đế bánh lên men tự nhiên, mềm bên trong, giòn nhẹ ở rìa, không chất bảo quản.</p>
            </article>
          </div>
        </div>
      </section>

      {/* taoj 
      . */}
      <section className="about-team">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Đội ngũ</p>
            <h2>Đội ngũ đứng sau mỗi chiếc pizza</h2>
          </div>

          <div className="team-grid">
            <article className="team-card">
              <div
                className="team-avatar"
                style={{ backgroundImage: "url('/beptruong.jpg')" }}
                title="Bếp trưởng"
              />
              <h3>Hoàng Long</h3>
              <p className="team-role">Bếp trưởng</p>
              <p>Phụ trách công thức bột và tiêu chuẩn nướng để mỗi chiếc pizza đều đúng vị.</p>
            </article>
            <article className="team-card">
              <div
                className="team-avatar"
                style={{ backgroundImage: "url('/quanli.jpg')" }}
                title="Quản lý bếp"
              />
              <h3>Nhật Minh</h3>
              <p className="team-role">Quản lý bếp</p>
              <p>Giám sát chất lượng chuẩn bị nguyên liệu và kiểm soát quy trình ra món.</p>
            </article>
            <article className="team-card">
              <div
                className="team-avatar"
                style={{ backgroundImage: "url('/giaohang.jpg')" }}
                title="Điều phối giao hàng"
              />
              <h3>Huy Hoàng</h3>
              <p className="team-role">Điều phối giao hàng</p>
              <p>Tối ưu lộ trình giao để pizza đến tay bạn nóng hổi và đúng giờ.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Final CTA points users back into the main revenue path: the menu. */}
      <section className="about-cta">
        <div className="container about-cta-card">
          <div>
            <p className="section-kicker">Gọi món ngay</p>
            <h2>Sẵn sàng thưởng thức chưa?</h2>
            <p>Chọn món bạn thích, chúng tôi sẽ chuẩn bị và giao thật nhanh đến tận cửa.</p>
          </div>

          <Link to="/menu">
            <Button variant="primary" size="large">Đặt hàng ngay</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
