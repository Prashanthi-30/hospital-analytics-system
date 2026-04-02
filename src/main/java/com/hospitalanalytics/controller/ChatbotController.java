package com.hospitalanalytics.controller;

import com.hospitalanalytics.service.ChatbotService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public String ask(@RequestBody String message) {
        return chatbotService.query(message);
    }
}