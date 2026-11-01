package com.uptime.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            try {
                Claims claims = jwtTokenProvider.validateAndParseClaims(token);
                String tokenType = claims.get("type", String.class);
                String requestUri = request.getRequestURI();

                // Enforce that TEMP_2FA tokens can ONLY be used on /api/v1/admin/auth/verify-2fa
                if ("TEMP_2FA".equals(tokenType) && !requestUri.endsWith("/admin/auth/verify-2fa")) {
                    log.warn("Rejected TEMP_2FA token used on non-2FA endpoint: {}", requestUri);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"success\":false,\"error\":{\"code\":\"AUTH_004\",\"message\":\"Temporary 2FA token is only valid for 2FA verification\"}}");
                    return;
                }

                Long userId = Long.parseLong(claims.getSubject());
                String role = claims.get("role", String.class);
                String industry = claims.get("industry", String.class);
                @SuppressWarnings("unchecked")
                List<String> permissions = (List<String>) claims.get("permissions", List.class);

                CustomUserDetails userDetails = CustomUserDetails.builder()
                        .id(userId)
                        .subject(claims.getSubject())
                        .role(role)
                        .industry(industry)
                        .tokenType(tokenType)
                        .permissions(permissions)
                        .build();

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                log.debug("Invalid or expired JWT token: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
