package com.kata.proyect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
			System.out.println("Usuario mail: " + System.getenv("MAIL_USERNAME"));
			System.out.println("Contraseña mail: " + System.getenv("MAIL_PASSWORD"));
	}

}
