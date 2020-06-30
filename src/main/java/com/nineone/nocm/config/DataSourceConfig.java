package com.nineone.nocm.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {
	@Bean
	public HikariConfig hikariConfig() {
		HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl("jdbc:mysql://localhost:3306/nocm?serverTimezone=Asia/Seoul&characterEncoding=UTF-8&verifyServerCertificate=false&useSSL=false");
        config.addDataSourceProperty("user", "91cm");
        config.addDataSourceProperty("password", "91cm");
		return config;
	}
	
	@Bean 
	public DataSource dataSource() {
		DataSource dataSource = new HikariDataSource(hikariConfig());
		return dataSource;
	}
	
	 @Bean 
	 public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) throws Exception {
		 SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
		 sqlSessionFactory.setDataSource(dataSource);
	  
		 PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		 Resource[] resources = resolver.getResources("classpath:mapper/**/*-mapper.xml");
		 sqlSessionFactory.setMapperLocations(resources);
		 return sqlSessionFactory; 
	 }
	  
	 @Bean(destroyMethod = "clearCache") 
	 public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) { 
		 return new SqlSessionTemplate(sqlSessionFactory); 
	 }
	 
	 @Bean
	 public PlatformTransactionManager transactionManager() {
	        return new DataSourceTransactionManager(dataSource());
	    }
	
}
