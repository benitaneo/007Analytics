# In a lambda function, remember to use the botocore version of requests. 
from botocore.vendored import requests
#from bs4 import BeautifulSoup as BS
import zipfile
import json
import time
import os.path
import io
import datetime
import math
from random import randint

# First 20 levels
targetlevel = ['dungeons-of-kithgard',
'gems-in-the-deep',
'shadow-guard',
'forgetful-gemsmith',
"loop-da-loop",
"true-names",
"the-raised-sword",
"haunted-kithmaze",
"the-second-kithmaze",
"dread-door",
"known-enemy",
"master-of-names",
"lowly-kithmen",
'cupboards-of-kithgard',
'breakout',
"closing-the-distance",
"the-final-kithmaze",
"kithgard-gates",
"a-mayhem-of-munchkins",
"the-gauntlet"]

# Objectives of first 20 levels
objectives = {'dungeons-of-kithgard': {'objectives': 'Students will correctly format code in Python, Students will be able to call methods',
                                      'topics':'Basic Syntax, call methods', 'w3': 'https://www.tutorialspoint.com/python/python_basic_syntax.htm'},
              'gems-in-the-deep':{'objectives': 'Students will correctly format code in Python, Students will be able to call methods',
                                      'topics':'Basic Syntax, call methods', 'w3': 'https://www.tutorialspoint.com/python/python_basic_syntax.htm'},
              'shadow-guard':{'objectives':'Students will correctly format code in Python, Students will be able to call methods, Students will be able to pass arguments to their methods', 
                             'topics':'Basic Syntax, call methods, pass arguments to methods', 'w3': 'https://www.tutorialspoint.com/python/python_basic_syntax.htm'},
              'forgetful-gemsmith':{'objectives': 'Students will be able to pass arguments to their methods,  Students will correctly format code in Python', 
                                   'topics': 'Arguments, Basic Syntax ', 'w3': 'https://www.tutorialspoint.com/python/python_basic_syntax.htm'},
              'loop-da-loop':{'objectives': 'Students will be able to write a loop with proper syntax',
                                   'topics': 'Basic Syntax, While Loops', 'w3': 'https://www.tutorialspoint.com/python/python_loops.htm'},
              'true-names':{'objectives': 'Students will be able to pass arguments to their methods, Students will be able to recognize a string in a line of code,  Students will be able to use strings in their code ',
                            'topics': 'Arguments, Basic Syntax, Strings',  'w3': 'https://www.tutorialspoint.com/python/python_strings.htm'},
              'the-raised-sword':{'objectives': 'Students will be able to pass arguments to their methods,  Students will be able to use strings in their code',
                                 'topics': 'Arguments, Basic Syntax, Strings',  'w3': 'https://www.tutorialspoint.com/python/python_strings.htm'},
              'haunted-kithmaze':{'objectives': 'Students will be able to write a loop with proper syntax',
                                 'topics': 'Basic Syntax, While Loops', 'w3': 'https://www.tutorialspoint.com/python/python_loops.htm'},
              'the-second-kithmaze':{'objectives': 'Students will be able to write a loop with proper syntax',
                                 'topics': 'Basic Syntax, While Loops', 'w3': 'https://www.tutorialspoint.com/python/python_loops.htm'},
              'dread-door':{'objectives': 'Students will be able to pass arguments to their methods, Students will be able to recognize a string in a line of code,  Students will be able to use strings in their code, Students will be able to write a loop with proper syntax',
                           'topics': 'Arguments, Basic Syntax, Strings, While Loops',  'w3': 'https://www.tutorialspoint.com/python/python_loops.htm'},
              'known-enemy':{'objectives': 'Students will use a variable to save and recall data',
                            'topics': 'Arguments, Basic Syntax, Strings, Variables',  'w3': 'https://www.tutorialspoint.com/python/python_strings.htm'},
              'master-of-names':{'objectives': 'Students will use a variable to save and recall data',
                            'topics': 'Arguments, Basic Syntax, Strings, Variables',  'w3': 'https://www.tutorialspoint.com/python/python_variable_types.htm'},
              'lowly-kithmen':{'objectives': 'Students will use a variable to save and recall data',
                            'topics': 'Arguments, Basic Syntax, Strings, Variables', 'w3': 'https://www.tutorialspoint.com/python/python_variable_types.htm'},
              'cupboards-of-kithgard':{'objectives': 'Students will be able to pass arguments to their methods, Students will be able to recognize a string in a line of code,  Students will be able to use strings in their code, Students will be able to write a loop with proper syntax  ',
                                      'topics': 'Arguments, Basic Syntax, Strings, While Loops',  'w3': 'https://www.tutorialspoint.com/python/python_strings.htm'},
              'breakout':{'objectives': 'Students will be able to pass arguments to their methods, Students will be able to recognize a string in a line of code,  Students will be able to use strings in their code, Students will be able to write a loop with proper syntax  ',
                         'topics': 'Arguments, Basic Syntax, Strings, While Loops',  'w3': 'https://www.tutorialspoint.com/python/python_loops.htm'},
              'closing-the-distance':{'objectives': 'Students will use a variable to save and recall data',
                            'topics': 'Arguments, Basic Syntax, Strings, Variables', 'w3': 'https://www.tutorialspoint.com/python/python_variable_types.htm'},
              'the-final-kithmaze':{'objectives':'Students will be able to correctly format code in Python,  Students will be able to call methods,  Students will be able look at a method and say the object it is attached to,  Students will be able to pass arguments to their methods,  Students will be able to write a loop with proper syntax,  Students will use a variable to save and recall the result of a method,  Students will be able to use a variable to store a value and overwrite it with changes to the value ',
                                   'topics':'Arguments, Basic Syntax, Variables, While Loops', 'w3': 'https://www.tutorialspoint.com/python/python_variable_types.htm'},
              'kithgard-gates':{'objectives': 'Students will be able to pass arguments to their methods,  Students will be able to use strings in their code',
                               'topics':'Arguments, Basic Syntax, Strings', 'w3': 'https://www.tutorialspoint.com/python/python_variable_types.htm'},
              'a-mayhem-of-munchkins':{'objectives':'Students will use a variable to save and recall the result of a method,  Students will be able to use a variable to store a value and overwrite it with changes to the value,  Students will be able to write a loop with proper syntax',
                                      'topics': 'Arguments, Basic Syntax, Variables, While Loops'},
              'the-gauntlet':{'objectives':'Students will use a variable to save and recall the result of a method, Students will be able to use a variable to store a value and overwrite it with changes to the value,  Students will be able to write a loop with proper syntax',
                             'topics': 'Arguments, Basic Syntax, Variables, While Loops', 'w3': 'https://www.tutorialspoint.com/python/python_variable_types.htm'}
             }
             
uidAndEmail = {'-L5l1B3oMjSFc5D-gOMD':'einstein@highsch.nus.edu.sg',
               '-L5mVlgCkNvgyRY0zxs7':'njc@moe.edu.sg',
               '-L5vcNNcjzzBqJcVSjmv':'junyuan_ss@moe.edu.sg',
               '-L60q5GZmPxgQ420h9z0':'dhs@moe.edu.sg',
               '-L60s0CDmpz0Z0bfO5c_':'contactus@sst.edu.sg',
               '-L60sKuLXUZZar30TVT2':'temasek_jc@moe.edu.sg',
               '-L60saW5rqNZDWHvdgWi':'nhhs@moe.edu.sg',
               '-L60uufBY4XcB-e7eV7T':'msh@moe.edu.sg ',
               '-L6Ozw0_igZQImRlwDVb':'info@crestsec.edu.sg',
               '-L6Q0DtblJxmN2EjqYt0':'scgss@moe.edu.sg',
               '-L6Vhl6Ex6UmOBDuxIIl':'qss@moe.edu.sg',
               '-L6a1_onZ7xKNNVcisOR':'westspringss@moe.edu.sg',
               '-L6a6jebX4VsdNCwNLEl':'ctss@moe.edu.sg',
               '-L6ylmVWpk7GHnAv72l3':'skss@moe.edu.sg',
               '-L6zB79NHIC9zjfeBuuO':'pyss@moe.edu.sg',
               '-L6zyZyvQnZi7WTgfRJO':'chijsng_sec@moe.edu.sg',
               '-L7nhqxUptPaiORRiGXh':'HIHS@moe.edu.sg',
               '-L5l15wSbh74cuypZvWn':'einstein@highsch.nus.edu.sg',
               '-L5mVu0KCQmU549n7t3g':'njc@moe.edu.sg',
               '-L60pzPUjO4UMJIpwdUY':'dhs@moe.edu.sg',
               '-L60rybnvLEmJ3AjCbIq':'raffles@ri.edu.sg',
               '-L60sGvy2bi-caQgaH37':'temasek_jc@moe.edu.sg',
               '-L60vg8ILeMZ7VnIQm5z':'pioneer_jc@moe.edu.sg',
               '-L60vtFYGuFzoGgSsnpQ':'jurong_jc@moe.edu.sg',
               '-L60wCbYrPybMdKThfmb':'innova_jc@moe.edu.sg',
               '-L7-2SKXunC08ULKCa4X':'yishun_jc@moe.edu.sg',
               '-L60zNp5NCKSpQuHIGyl':'wellingtonps@moe.edu.sg',
               '-L6pheIOYHz1McDzNryF':'acps@moe.edu.sg'    
               }
               
class Student:
  def __init__(self, uid, sch_id):
    self.uid = uid
    self.name = ''
    self.sch_id = sch_id
    self.cohort_id = ''
    self.school = ''
    self.photoURL = ''
    self.lastactive = ''
    self.achievements = ''
  # Getter methods  
  def get_uid(self):
    return self.uid
  
  def get_name(self):
    return self.name
  
  def get_school(self):
    return self.school
  
  def get_sch_id(self):
    return self.sch_id
  
  def get_cohort_id(self):
    return self.cohort_id
  
  def get_photo(self):
    return self.photoURL
  
  def get_lastactive(self):
    return self.lastactive
  
  def get_achievements(self):
    return self.achievements
  # Setter methods
  def add_name(self, name):
    self.name = name
  
  def add_school(self, school):
    self.school = school
    
  def add_cohort_id(self, cohort_id):
    self.cohort_id = cohort_id
  
  def add_photo(self, photoURL):
    self.photoURL = photoURL
    
  def add_lastactive(self, lastactive):
    self.lastactive = lastactive
    
  def add_achievements(self, achievements):
    self.achievements = achievements

# downloading data from api
def download_file(token,option):
# Check to see if file already exists
  filename = option+".json"
  fileExists = os.path.isfile(filename) 
  
  if not fileExists:
    print("Downloading", option, "and saving to", filename, end='')
    url = "https://us-central1-achievements-prod.cloudfunctions.net/api?token="+token+"&data="+option
    response = requests.get(url, stream=True)

    # Throw an error for bad status codes
    response.raise_for_status()
    with open('/tmp/' + filename, 'wb') as handle:
      for block in response.iter_content(1024*128):  # Load 128KB at a time and provide feedback. 
          print('.', end='') # print without new line
          handle.write(block)
    print('\n',filename, "downloaded.")
  else:
     print(filename, "exists. Skipping download")
      
# opening json file      
def get_dict_from_file(fname):
  d = {}
  with open(fname) as json_data:
      d = json.load(json_data)
  return d

# Getting list of admins
def get_admin(file1): #each cohort has one admin
  adminlist = {}
  cohort_data = get_dict_from_file(file1)
  for cohort in cohort_data.items():
    lst = [cohort[1]['name']]
    admin = {}
    admin[cohort[1]['owner']] = cohort[1]['instructorName']
    lst.append(admin)
    adminlist[cohort[0]] = lst
  return adminlist
################################################################ Student Objects ####################################################################
def percentile(N, percent, key=lambda x:x):
    """
    Find the percentile of a list of values.

    @parameter N - is a list of values. Note N MUST BE already sorted.
    @parameter percent - a float value from 0.0 to 1.0.
    @parameter key - optional key function to compute value from each element of N.

    @return - the percentile of the values
    """
    if not N:
        return None
    k = (len(N)-1) * percent
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return key(N[int(k)])
    d0 = key(N[int(f)]) * (c-k)
    d1 = key(N[int(c)]) * (k-f)
    return d0+d1

# Flattening cohortCourses json
def flatten_cohortCourses(file1,file2,file3):
  # Getting required information from api  
  students_json = get_dict_from_file(file1) # student information
  users_json = get_dict_from_file(file2) # all users information
  all_schools_before = get_dict_from_file(file3) # all schools information

  all_schools = []
  for cat in all_schools_before:
    for sch in all_schools_before[cat]:
      all_schools.append(all_schools_before[cat])
  
  return all_schools

# Creating student objects
def create_student_array(file1,arr1):
  students_json = get_dict_from_file(file1) # student information
  for sch_id in students_json:
    for user_id in students_json[sch_id]:
      student = Student(user_id, sch_id)
      arr1.append(student)

# Adding name to student objects
def add_name_to_student(file1,arr1,arr2):
  users_json = get_dict_from_file(file1) # all users information
  for user in users_json:
    for student in arr1:
      if (user == student.get_uid()):
        try:
          student.add_name(users_json[user]['displayName'])
          student.add_photo(users_json[user]['photoURL'])
        except KeyError:
          student.add_name('Unknown Name')
          student.add_photo('Unknown URL')
          arr2.append(user)
          
# Adding school to student objects
def add_school_to_student(arr1,arr2):
  for student in arr1:
    for i in range(len(arr2)):
      for key in arr2[i]:
        if (student.get_sch_id() == key):
          sch = arr2[i][key]['name']
          student.add_school(sch)

# Add no. of achievements and last active into student
def add_achievements_lastactive_to_student(arr1, arr2):
    for student in arr1:
      try:
        if "CodeCombat" in arr2[student.get_uid()]:
          if 'achievements' in arr2[student.get_uid()]['CodeCombat']:
            student.add_achievements(len(arr2[student.get_uid()]['CodeCombat']['achievements']))
            student.add_lastactive(datetime.datetime.fromtimestamp(
                int(arr2[student.get_uid()]['CodeCombat']['lastUpdate'])/1000).
                               strftime('%Y-%m-%d %H:%M'))
      except KeyError:
        student.add_achievements("No Completed Levels")
        student.add_lastactive("No Last Active")

# Add cohort_id of school into student
def add_cohort_id_to_student(file1, arr1):
  cohorts_json = get_dict_from_file(file1)
  for cohort in cohorts_json:
    for school in cohorts_json[cohort]:
      if school in arr1:
        for student in arr1[school]:
          student.add_cohort_id(cohort)
          
# Getting dictionary of schools (as keys), students (as values)
def sort_all_students_by_sch(arr1,arr2):
  student_dict = {}
  for i in range(len(arr2)):
    for key in arr2[i]:
      student_dict[key] = []
    
  # Add students into respective school
  for student in arr1:
    for sch in student_dict:
      if (student.get_sch_id() == sch):
        student_dict[sch].append(student)
        
  return student_dict

# Getting name of user
def returnName(userID, file1, file2, file3):
  #file1,users.json;file2,cohortCourses.json;file3,cohorts.json
  user_data = get_dict_from_file(file1) # get the studentsID and name
  cohortCourses_data = get_dict_from_file(file2) # get the schoolID and name
  cohorts_data = get_dict_from_file(file3) # get admin iD
  for i in user_data.items():
    if userID == i[0]:
      return i[1]['displayName']
  for i in cohortCourses_data.items():
    for j in i[1].items():
      if j[0] == userID:
        return j[1]['name']
  for i in cohorts_data.items():
    if i[1]['owner'] == userID:
      return i[1]['instructorName']

# Getting latest articles
def get_website_element(website):
    r = requests.get(website)
    data = BS(r.content, "lxml")
    final_stash = []
    all_articles = data.find_all("div", {"class": "u-flexColumn"})
    for i in range(len(all_articles)):
        weblink = all_articles[i].find('a')['href']
        title = (all_articles[i].find('a').text).replace("\xa0", " ")
        summary = all_articles[i].find("h4", {"class": "ui-summary"})
        try:
            if (summary.get_text() != None):
                new = [title, weblink, summary.get_text()]
                final_stash.append(new)
                #print("This is the title of the article, \"{}\" it's respective link, {} , and a short summary, {}.".format(title, weblink, summary.get_text()))
                #print()
            else:
                #print("This is the title of the article, \"{}\" and it's respective link, {}.".format(title, weblink))
                print()
        except:
            print("pass")
            #print()
    return final_stash
