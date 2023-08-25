package com.skyexchange.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

	@RequestMapping("/")
	public String admin(Model model) {
		model.addAttribute("title", "Login - Sky Exchange");
		return "login";
	}
	
	@RequestMapping("/home")
	public String home(Model model) {
		model.addAttribute("title", "Home - Sky Exchange");
		model.addAttribute("js", "home.js");
		return "home";
	}

	@RequestMapping("/home/{id}/{usertype}")
	public String parentChildHome(Model model, @PathVariable String id, @PathVariable String usertype) {
		if(id != null && usertype != null){
			model.addAttribute("title", "Home - Sky Exchange");
			model.addAttribute("js", "parentchildhome.js");
			return "parentchildhome";
		}
		return "home";
	}

	@RequestMapping("/account")
	public String account(Model model) {
		model.addAttribute("title", "Account - Sky Exchange");
		model.addAttribute("js", "account.js");
		return "myaccount";
	}

	@RequestMapping("/profitdownline")
	public String profitdownline(Model model) {
		model.addAttribute("title", "Profit Downline - Sky Exchange");
		model.addAttribute("js", "profitdownline.js");
		return "profit-downline";
	}

	@RequestMapping("/profitmarket")
	public String profitmarket(Model model) {
		model.addAttribute("title", "Profit Market - Sky Exchange");
		model.addAttribute("js", "profitmarket.js");
		return "profit-market";
	}

	@RequestMapping("/betlist")
	public String betlist(Model model) {
		model.addAttribute("title", "Betlist - Sky Exchange");
		model.addAttribute("js", "betlist.js");
		return "betlist";
	}

	@RequestMapping("/riskmanagement")
	public String riskmanagement(Model model) {
		model.addAttribute("title", "Risk Management - Sky Exchange");
		model.addAttribute("js", "riskmanagement.js");
		return "risk-management";
	}

	@RequestMapping("/banking")
	public String banking(Model model) {
		model.addAttribute("title", "Banking - Sky Exchange");
		model.addAttribute("js", "banking.js");
		return "banking";
	}

	@RequestMapping("/profile")
	public String profile(Model model) {
		model.addAttribute("title", "Profile - Sky Exchange");
		model.addAttribute("js", "profile.js");
		return "profile";
	}

	@RequestMapping("/activitylog")
	public String activitylog(Model model) {
		model.addAttribute("title", "Activity Log - Sky Exchange");
		model.addAttribute("js", "activitylog.js");
		return "activity-log";
	}

	@RequestMapping("/accountstatement")
	public String accountstatement(Model model) {
		model.addAttribute("title", "Account Statement - Sky Exchange");
		model.addAttribute("js", "accountstatement.js");
		return "account-statement";
	}

}
