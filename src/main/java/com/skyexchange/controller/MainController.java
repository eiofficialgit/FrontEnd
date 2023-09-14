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

	@RequestMapping("/adminsetting")
	public String adminsetting(Model model) {
		model.addAttribute("title", "Admin Setting - Sky Exchange");
		model.addAttribute("js", "adminsetting.js");
		return "admin-setting";
	}

	@RequestMapping("/websitesetting")
	public String websitesetting(Model model) {
		model.addAttribute("title", "Website Setting - Sky Exchange");
		model.addAttribute("js", "websitesetting.js");
		return "website-setting";
	}

	@RequestMapping("/addwebsite")
	public String addwebsite(Model model) {
		model.addAttribute("title", "Add Website - Sky Exchange");
		model.addAttribute("js", "addwebsite.js");
		return "addwebsite-setting";
	}

	@RequestMapping("/searchuser")
	public String searchuser(Model model) {
		model.addAttribute("title", "Search User - Sky Exchange");
		model.addAttribute("js", "searchuser.js");
		return "search-user";
	}

	@RequestMapping("/surveillance") 
	public String surveillance(Model model) {
		model.addAttribute("title", "Surveillance - Sky Exchange");
		model.addAttribute("js", "surveillance.js");
		return "surveillance";
	}

	@RequestMapping("/userImpMessage") 
	public String userImpMessage(Model model) {
		model.addAttribute("title", "User Imp Message - Sky Exchange");
		model.addAttribute("js", "userimpmessage.js");
		return "userImp-Message";
	}

	@RequestMapping("/uplineImpMessage") 
	public String uplineImpMessage(Model model) {
		model.addAttribute("title", "Upline Imp Message - Sky Exchange");
		model.addAttribute("js", "uplineimpmessage.js");
		return "uplineImp-Message";
	}

	@RequestMapping("/hyperMessage") 
	public String hyperMessage(Model model) {
		model.addAttribute("title", "Hyper Message - Sky Exchange");
		model.addAttribute("js", "hypermessage.js");
		return "hyper-Message";
	}

	@RequestMapping("/userMessage") 
	public String userMessage(Model model) {
		model.addAttribute("title", "User Message - Sky Exchange");
		model.addAttribute("js", "usermessage.js");
		return "user-Message";
	}

	@RequestMapping("/creditReferenceLog/{userid}") 
	public String log(Model model, @PathVariable String userid) {
		if(userid != null){
			return "log";
		}
		return "home";
	}

	@RequestMapping("/userprofile/{userid}")
	public String userprofile(Model model, @PathVariable String userid) {
		if(userid != null){
			model.addAttribute("title", "Profile - Sky Exchange");
			model.addAttribute("js", "userprofile.js");
			return "userprofile";
		}
		return "home";
	}

	@RequestMapping("/useractivitylog/{userid}")
	public String useractivitylog(Model model, @PathVariable String userid) {
		if(userid != null){
			model.addAttribute("title", "Activity Log - Sky Exchange");
			model.addAttribute("js", "useractivitylog.js");
			return "useractivity-log";
		}
		return "home";
	}

	@RequestMapping("/useraccountstatement/{userid}")
	public String useraccountstatement(Model model, @PathVariable String userid) {
		if(userid != null){
			model.addAttribute("title", "Account Statement - Sky Exchange");
			model.addAttribute("js", "useraccountstatement.js");
			return "useraccount-statement";
		}
		return "home";
	}

	@RequestMapping("/userbettinghistory/{userid}")
	public String userbettinghistory(Model model, @PathVariable String userid) {
		if(userid != null){
			model.addAttribute("title", "Betting History - Sky Exchange");
			model.addAttribute("js", "userbettinghistory.js");
			return "userbettinghistory";
		}
		return "home";
	}

	@RequestMapping("/userprofitloss/{userid}")
	public String userprofitloss(Model model, @PathVariable String userid) {
		if(userid != null){
			model.addAttribute("title", "Profit Loss - Sky Exchange");
			model.addAttribute("js", "userprofitloss.js");
			return "userprofitloss";
		}
		return "home";
	}

	@RequestMapping("/addmatch") 
	public String addMatch(Model model) {
		model.addAttribute("title", "Add Match - Sky Exchange");
		model.addAttribute("js", "addmatch.js");
		return "addmatch";
	}

	@RequestMapping("/activematch") 
	public String activeMatch(Model model) {
		model.addAttribute("title", "Active Match - Sky Exchange");
		model.addAttribute("js", "activematch.js");
		return "activematch";
	}

	@RequestMapping("/inactivematch") 
	public String inActiveMatch(Model model) {
		model.addAttribute("title", "Inactive - Sky Exchange");
		model.addAttribute("js", "inactivematch.js");
		return "inactivematch";
	}

	@RequestMapping("/suspendedmarketresult") 
	public String suspendedMarketResult(Model model) {
		model.addAttribute("title", "Inactive - Sky Exchange");
		model.addAttribute("js", "suspendedmarketresult.js");
		return "suspendedmarketresult";
	}

	@RequestMapping("/suspendedresults") 
	public String suspendedResults(Model model) {
		model.addAttribute("title", "Suspended Results - Sky Exchange");
		model.addAttribute("js", "suspendedresults.js");
		return "suspendedresults";
	}

}
