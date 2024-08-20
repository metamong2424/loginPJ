const express = require("express"); // Express.js 모듈을 불러옴
const session = require("express-session"); // 세션 관리 미들웨어
const passport = require("passport"); // Passport.js 모듈을 불러옴 (OAuth 인증용)
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google OAuth 2.0 전략
const jwt = require("jsonwebtoken"); // JWT 생성 및 검증을 위한 모듈
const dotenv = require("dotenv"); // 환경 변수를 로드하기 위한 모듈
const sequelize = require("./config/database"); // Sequelize 데이터베이스 설정
const User = require("./models/user"); // 사용자 모델
const authRoutes = require("./routes/authRoutes"); // 인증 라우트
const cors = require("cors"); // CORS 설정을 위한 미들웨어

dotenv.config(); // .env 파일에 정의된 환경 변수를 로드

const app = express(); // Express 애플리케이션 인스턴스 생성

// CORS 설정: 프론트엔드의 요청을 허용
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드가 실행되는 주소
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);

// 세션 설정: 사용자 세션을 관리
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret", // 세션 암호화를 위한 비밀키
    resave: false, // 세션 데이터가 변경되지 않았을 때에도 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
    cookie: {
      secure: false, // HTTPS 환경에서만 쿠키를 전송하려면 true로 설정
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효 기간 (1일)
    },
  })
);

// Passport 초기화 및 세션 관리
app.use(passport.initialize()); // Passport 초기화
app.use(passport.session()); // Passport를 사용해 세션을 관리

// 데이터베이스 연결 및 초기화
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync(); // 테이블이 없으면 생성
  })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Google OAuth 설정: 사용자가 Google로 로그인할 수 있도록 설정
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google 클라이언트 ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google 클라이언트 비밀키
      callbackURL: "/auth/callback", // 인증 후 리디렉션될 URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } }); // 기존 사용자 검색
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            token: accessToken,
          }); // 신규 사용자 생성
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        }); // JWT 토큰 생성
        return done(null, { user, token }); // 사용자 정보와 토큰을 반환
      } catch (error) {
        return done(error, null); // 오류 발생 시 처리
      }
    }
  )
);

// Google OAuth 인증 성공 후 처리
app.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/", // 인증 실패 시 리디렉션될 URL
  }),
  (req, res) => {
    const token = req.user.token; // 인증 후 발급된 토큰
    res.redirect(`http://localhost:3000?token=${token}`); // 프론트엔드로 토큰 전달
  }
);

// Passport 세션 설정: 사용자 정보를 세션에 저장하고, 세션에서 사용자 정보를 복구
passport.serializeUser((user, done) => {
  done(null, user.user.id); // 세션에 사용자 ID 저장
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // 세션에서 사용자 ID로 사용자 정보 복구
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// 인증 라우트 등록
app.use("/auth", authRoutes);

// 서버 시작
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001"); // 서버가 실행 중임을 알림
});

// 나눠야 할것 GPT에 물어보고 처리.
// CSS는 (마지막에) 처리.
