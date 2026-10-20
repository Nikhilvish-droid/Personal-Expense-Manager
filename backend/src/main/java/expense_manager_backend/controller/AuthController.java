package expense_manager_backend.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Signup and Login.
// On success we send back a JWT token + user details, react saves it in localStorage.
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JdbcTemplate db;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SecretKey jwtKey;

    public AuthController(JdbcTemplate db, @Value("${JWT_SECRET}") String jwtSecret) {
        this.db = db;
        this.jwtKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // what the frontend sends us
    public record SignupRequest(String name, String email, String password) {}
    public record LoginRequest(String email, String password) {}

    // POST /api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {

        Integer count = db.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ?", Integer.class, req.email());

        if (count != null && count > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }

        // never save the real password, only the bcrypt hash
        String passwordHash = passwordEncoder.encode(req.password());

        Long userId = db.queryForObject("""
                INSERT INTO users (name, email, password_hash, created_at, updated_at)
                VALUES (?, ?, ?, now(), now())
                RETURNING id
                """, Long.class, req.name(), req.email(), passwordHash);

        return ResponseEntity.ok(makeAuthResponse(userId, req.name(), req.email()));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        List<Map<String, Object>> users = db.queryForList(
                "SELECT id, name, email, password_hash FROM users WHERE email = ?", req.email());

        if (users.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        Map<String, Object> user = users.get(0);
        String savedHash = (String) user.get("password_hash");

        if (!passwordEncoder.matches(req.password(), savedHash)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        Long userId = (Long) user.get("id");
        return ResponseEntity.ok(
                makeAuthResponse(userId, (String) user.get("name"), (String) user.get("email")));
    }

    // creates the token (valid for 1 day) and the json the frontend expects
    private Map<String, Object> makeAuthResponse(Long userId, String name, String email) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        String token = Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(jwtKey)
                .compact();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", token);
        response.put("userId", userId);
        response.put("name", name);
        response.put("email", email);
        return response;
    }
}
