package com.nineone.nocm.config;

import com.nineone.nocm.domain.User;
import com.nineone.nocm.repository.UserAuthoritiesRepository;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Aspect
@Component
public class AopConfig {

    @Autowired
    private UserAuthoritiesRepository authoritiesRepository;

    @Pointcut("execution(* com.nineone.nocm.controller.api.UserApiController.getSessionUser(..))")
    public void getSessionUser(){}

    @Pointcut("execution(* com.nineone.nocm.controller.api.UserApiController.userInfo(..))")
    public void userInfo(){}

    @Pointcut("execution(* com.nineone.nocm.controller.api.UserApiController.rolesUserList(..))")
    public void roleUserList(){}



    @Around("roleUserList()")
    public Object checkUserAdmin(ProceedingJoinPoint joinPoint) throws Throwable{
        User user = (User) joinPoint.getArgs()[0];
        List<String> roles = authoritiesRepository.getUserRoles(user.getEmail());
        if (roles.stream().anyMatch(role -> role.equals("ROLE_ADMIN"))){
            return joinPoint.proceed();
        }else{
            return new ResponseEntity<>("{}",HttpStatus.BAD_REQUEST);
        }
    }


    @Around("userInfo()||getSessionUser()")
    public Object CheckUserRole(ProceedingJoinPoint joinPoint) throws Throwable{
        User user = (User)joinPoint.getArgs()[0];
        user.setRoles(authoritiesRepository.getUserRoles(user.getEmail()));

        return joinPoint.proceed();
    }
}
