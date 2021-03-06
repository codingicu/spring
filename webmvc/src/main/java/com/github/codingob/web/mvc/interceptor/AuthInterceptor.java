package com.github.codingob.web.mvc.interceptor;

import com.github.codingob.web.mvc.handler.UnauthorizedException;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Interceptor
 *
 * @author codingob
 * @version 1.0.0
 * @since JDK1.8
 */
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object username = session.getAttribute("username");
//        if (username == null) {
//            throw new UnauthorizedException();
//        }
        return true;
    }
}
