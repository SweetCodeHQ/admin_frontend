from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementNotInteractableException
import unittest
import time
class SeleniumTest(unittest.TestCase):
 

   def setUp(self):
        sauce_url = 'https://oauth-devon-c2059:5e454851-cd08-4978-b8a1-6516a7f59c0f@ondemand.us-west-1.saucelabs.com:443/wd/hub' 
        options = webdriver.ChromeOptions()
        options.platform_name = "Windows 11"
        options.browser_version = "latest"
        options.add_argument("--incognito")
        sauce_options = {'name': 'testLoginIncognito', 'extendedDebugging':True}
        options.set_capability('sauce:options', sauce_options)
                                          
        self.driver = webdriver.Remote(command_executor=sauce_url, options=options)
               
   def tearDown(self):
        self.driver.quit()
     
   def test_sauce_labs(self):
     wait = WebDriverWait(self.driver, 10)
     google_user_json = {"iss":"https://accounts.google.com","nbf":1682540848,"aud":"370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com","sub":"102319667935294498827","hd":"fixate.io","email":"devon@fixate.io","email_verified":'true',"azp":"370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com","name":"Devon McClure","picture":"https://lh3.googleusercontent.com/a/AGNmyxasqDVJMwT6bJfAl2i-Ds2fCX0IC142_unuguVr=s96-c","given_name":"Test User","family_name":"McClure","iat":1682541148,"exp":1682544748,"jti":"416c21318d29c6d787c6f420db44a80617dc7ea4"}

     self.driver.execute_script("sauce:intercept", {
    "url": "https://megaphone-ai-api.herokuapp.com/api/v1/topics",
        "response": {
                "data":{"id":"null",
                        "type":"ai_completion",
                        "attributes":{"model":"text-davinci-003",
                                      "text":"Give me 5 topics based on: \"python selenium tests automated assertions\"\n\n1. Test Topic 1\n2. Test Topic 2\n3. Test Topic 3\n4. Test Topic 4\n5. Test Topic 5",
                                      "usage":{"prompt_tokens":16,"completion_tokens":76,"total_tokens":92}}}
            ,
          }
    })
                     
     wait = WebDriverWait(self.driver, 10)

     google_user_json = {"iss":"https://accounts.google.com","nbf":1682540848,"aud":"370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com","sub":"102319667935294498827","hd":"fixate.io","email":"devon@fixate.io","email_verified":'true',"azp":"370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com","name":"Devon McClure","picture":"https://lh3.googleusercontent.com/a/AGNmyxasqDVJMwT6bJfAl2i-Ds2fCX0IC142_unuguVr=s96-c","given_name":"Test User","family_name":"McClure","iat":1682541148,"exp":1682544748,"jti":"416c21318d29c6d787c6f420db44a80617dc7ea4"}
       

     self.driver.get("https://the-megaphone.herokuapp.com")
      
     self.driver.execute_script(f'a = {google_user_json}')
     self.driver.execute_script('b = JSON.stringify(a)')
     self.driver.execute_script('localStorage.googleUser = b')

     self.driver.refresh()

     while True:
         try:
          wait.until(EC.element_to_be_clickable((By.XPATH,"//input[@name='word1']"))).send_keys('python')
          break
         except ElementNotInteractableException:
               print("Word1 element not interactable.")
     while True:
          try:
              wait.until(EC.element_to_be_clickable((By.XPATH,"//input[@name='word2']"))).send_keys('selenium')
              break
          except ElementNotInteractableException:
               print("Word2 element not interactable.")
     while True:
          try:
               wait.until(EC.element_to_be_clickable((By.XPATH,"//input[@name='word3']"))).send_keys('tests')
               break
          except ElementNotInteractableException:
               print("Word3 element not interactable.")
     while True:
           try:
               wait.until(EC.element_to_be_clickable((By.XPATH,"//input[@name='word4']"))).send_keys('automated')
               break
           except ElementNotInteractableException:
               print("Word4 element not interactable.")
     while True:
           try:
               wait.until(EC.element_to_be_clickable((By.XPATH,"//input[@name='word5']"))).send_keys('assertions')
               break
           except ElementNotInteractableException:
               print("Word5 element not interactable.")

     generate_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[.='Generate']")))
     generate_button.click()
       
     save_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[@class='text-white text-lg border-[1px] border-none outline-none rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-400 pr-5']")))
      
     save_button.click()
    
     elem_num_pages = self.driver.find_element(By.XPATH,"//div[@class='text-blue-300 pb-8']/div")
     txt_num_pages = elem_num_pages.get_attribute('innerText')
     str_num_pages = txt_num_pages.split("of ")[1]
     num_pages = int(str_num_pages)

     print(num_pages)

     for _ in range(1, num_pages):
          try:
               wait.until(EC.element_to_be_clickable((By.XPATH,"//div[@class=' text-blue-400']/p"))).click()
               time.sleep(1)
          except Exception:
               num_pages+=1
               print("Trying to click the next button again.")
                  
     saved_topics = wait.until(EC.presence_of_all_elements_located((By.XPATH,"//div[@class='text-white text-lg cursor-grab']")))
     saved_topics[-1].click()

     generate_abstract_button = wait.until(EC.presence_of_element_located((By.XPATH,"//button[.='Generate an Abstract!']")))
     generate_abstract_button.click()

     edit_abstract_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[@class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']")))
     edit_abstract_button.click()

     save_abstract_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//div[@class='mt-6 grid grid-flow-row-dense grid-cols-3 gap-3']/button[.='Save']")))
     save_abstract_button.click()

     edit_abstract_button2 = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[@class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']")))
     edit_abstract_button2.click()

     cancel_edit_abstract_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[@class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']")))
     cancel_edit_abstract_button.click()

     regenerate_abstract_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//span[.='Regenerate Abstract']/parent::*/parent::*")))
     regenerate_abstract_button.click()

     add_to_cart_from_popup = wait.until(EC.element_to_be_clickable((By.XPATH,"//div[@class='mt-6 grid grid-flow-row-dense grid-cols-3 gap-3']//button[@class='text-blue-300 text-2xl rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 false']")))
     add_to_cart_from_popup.click()

     back_button_popup = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[@class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']")))
     back_button_popup.click()

     view_cart_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//div[@class='w-full flex justify-between items-center p-4']/div/child::*[1]")))
     view_cart_button.click()

     delete_from_cart = wait.until(EC.element_to_be_clickable((By.XPATH,"//div[@class='items-center mb-5 flex justify-between w-full']/child::*[1]")))
     delete_from_cart.click()

     close_cart_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//div[@class='flex justify-between w-full']/child::*[3]")))
     close_cart_button.click()

     logout_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[.='Logout']")))
     logout_button.click()

     self.driver.execute_script('sauce:job-result=true')
        
      
if __name__ == '__main__':
   unittest.main()

