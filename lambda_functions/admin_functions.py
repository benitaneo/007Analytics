# In a lambda function, remember to use the botocore version of requests. 
from botocore.vendored import requests
import zipfile
import json
import time
import os.path
import io
import datetime
import math
from random import randint

# Import common variables and functions from general_functions.py
from general_functions import targetlevel, objectives, uidAndEmail, get_dict_from_file, percentile, flatten_cohortCourses, create_student_array, add_name_to_student, add_school_to_student, add_achievements_lastactive_to_student, add_cohort_id_to_student, sort_all_students_by_sch

def separatelogs(logs):
  lastdate = [1518969097289,
              1519570638599,
              1520179166641,
              1520783949758,
              1521388793831,
              1521993504702,
              1522598131232]
  separated = [{},{},{},{},{},{},{}]
  for log in logs:
    if logs[log]['createdAt'] <= lastdate[0]:
      separated[0][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[1]:
      separated[1][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[2]:
      separated[2][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[3]:
      separated[3][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[4]:
      separated[4][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[5]:
      separated[5][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[6]:
      separated[6][log] = logs[log]
    elif logs[log]['createdAt'] <= lastdate[7]:
      separated[7][log] = logs[log]
  return separated

def convertschool(schoolid, file1):
  cohortCourses_data = get_dict_from_file(file1)
  for cohort in cohortCourses_data:
    if schoolid in cohortCourses_data[cohort]:
      return cohortCourses_data[cohort][schoolid]['name']
  return 'BT3103'

def getschoolcohort(schoolid, file1, file2):
  cohortCourses_data = get_dict_from_file(file1)
  cohort_data = get_dict_from_file(file2)
  for cohort in cohortCourses_data:
    if schoolid in cohortCourses_data[cohort]:
      return cohort_data[cohort]['name']
  return 'BT3103'
  
# Getting number of sign-ins per week (activity rate)
def get_signin_number(file1, file2, file3, file4): # no. of sign ins per week
  weekly = separatelogs(file1)
  courseMembers = get_dict_from_file(file2)
  cohortCourses =  get_dict_from_file(file3)
  cohort_data = get_dict_from_file(file4)
  
  d = {} 
  for course in courseMembers:
    for member in courseMembers[course]:
      d[member] = course
  # because logs only available from week 7 onwards
  weekno = 7
  signins = {}
  schoolsignins = {}
    
  for cohort in cohort_data:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      schoolsignins[cohort_data[cohort]['name']] = {}
  for cohort in cohortCourses:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      for school in cohortCourses[cohort]:
        schoolsignins[cohort_data[cohort]['name']][cohortCourses[cohort][school]['name']] = {}
        for index in range(7,13):
          schoolsignins[cohort_data[cohort]['name']][cohortCourses[cohort][school]['name']][index]= 0
  schoolsignins['BT3103'] = {}
  for week in weekly:
    for log in week:
      if 'type' in week[log]:
        if week[log]['type'] == "SIGN_IN_SUCCESS":
          if week[log]['uid'] in d:
            school = convertschool(d[week[log]['uid']], file3)
            cohort = getschoolcohort(d[week[log]['uid']], file3, file4)
            if cohort in schoolsignins:
              if  school not in schoolsignins[cohort]:
                schoolsignins[cohort][school] = {}
              if weekno in schoolsignins[cohort][school]:
                schoolsignins[cohort][school][weekno] += 1
              else:
                schoolsignins[cohort][school][weekno] = 1
          
    weekno+=1
  return schoolsignins

# Getting number of sign-ups per week (effective reach out rate)
def get_signup_number(file1, file2, file3, file4): # no. of sign ups per week
  weekly = separatelogs(file1)
  courseMembers = get_dict_from_file(file2)
  cohortCourses =  get_dict_from_file(file3)
  cohort_data = get_dict_from_file(file4)
  d = {} 
  for course in courseMembers:
    for member in courseMembers[course]:
      d[member] = course
  weekno = 7
  signins = {}
  schoolsignups = {}
        
  for cohort in cohort_data:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      schoolsignups[cohort_data[cohort]['name']] = {}
  for cohort in cohortCourses:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      for school in cohortCourses[cohort]:
        schoolsignups[cohort_data[cohort]['name']][cohortCourses[cohort][school]['name']] = {}
        for index in range(7,13):
          schoolsignups[cohort_data[cohort]['name']][cohortCourses[cohort][school]['name']][index]= 0
  schoolsignups['BT3103'] = {}
  for week in weekly:
    for log in week:
      if 'type' in week[log]:
        if week[log]['type'] == 'ACCEPT_EULA_SUCCESS':
          if week[log]['uid'] in d:
            school = convertschool(d[week[log]['uid']], file3)
            cohort = getschoolcohort(d[week[log]['uid']], file3, file4)
            if cohort in schoolsignups:
              if  school not in schoolsignups[cohort]:
                schoolsignups[cohort][school] = {}
              if weekno in schoolsignups[cohort][school]:
                schoolsignups[cohort][school][weekno] += 1
              else:
                schoolsignups[cohort][school][weekno] = 1
          
    weekno+=1
  return schoolsignups

# Getting number of schools participating in each category
def get_total_no_school(file1, file2):
  #file1,cohorts.json;file2,cohortCourses.json
  cohort_data = get_dict_from_file(file1)
  cohortsKey = {};
  for x in cohort_data.items():
    cohortsKey[x[0]] = x[1]['name']
  cohortCourses_data = get_dict_from_file(file2)
  #List of schools per cohort 
  cohortSchool = {}; 
  for x in cohortCourses_data.items():
    if x[0] != "-L61sLrUjhzDEslszAVs" and x[0] != "-L61sX86hsGw4g1wNvKq" and x[0] != "-L6pTo-0a0LlP87H2Tir":
      for y in x[1].items():
        if cohortsKey[x[0]] not in cohortSchool:
          cohortSchool[cohortsKey[x[0]]] = [y[1]['name']]
        else:
          cohortSchool[cohortsKey[x[0]]] += [y[1]['name']]
  #Number of schools per cohort
  numSchool = {}; 
  for x in cohortSchool.items():
    numSchool[x[0]] = len(x[1])
  totalSchool = sum(numSchool.values()) #Total school
  return [totalSchool,numSchool]

# Getting number of students participating in each schools, sorted by category
def get_total_students_per_sch(file1, file2, file3, file4):
  # file1,cohorts.json;file2,cohortCourses.json;file3,courses.json;file4,courseMembers.json
  # Extracting from cohorts JSON
  cohort_data = get_dict_from_file(file1)
  cohortsKey = {};
  for x in cohort_data.items():
    cohortsKey[x[0]] = x[1]['name']
    
  # Extracting from cohort courses JSON  
  cohortCourses_data = get_dict_from_file(file2)
  cohortSchool = {}; #List of schools per cohort 
  for x in cohortCourses_data.items():
    if x[0] != "-L61sLrUjhzDEslszAVs" and x[0] != "-L61sX86hsGw4g1wNvKq" and x[0] != "-L6pTo-0a0LlP87H2Tir":
      for y in x[1].items():
        if cohortsKey[x[0]] not in cohortSchool:
          cohortSchool[cohortsKey[x[0]]] = [y[1]['name']]
        else:
          cohortSchool[cohortsKey[x[0]]] += [y[1]['name']]
          
  # Extracting from courses JSON        
  courses_data = get_dict_from_file(file3)
  schoolKeys = {}
  for school in courses_data.items():
    schoolKeys[school[0]] = ''
  for keys in schoolKeys.keys():
    schoolKeys[keys] = courses_data[keys]['name']
  schoolStudents = {}
  courseMember_data = get_dict_from_file(file4)
  for school in courseMember_data.items():
      schoolStudents[school[0]] =  len(school[1])
  
  # No of students per school categorised in cohorts
  cohortSchoolStudents = {} 
  for cohort in cohortCourses_data.items():
    if cohort[0] != "-L61sLrUjhzDEslszAVs" and cohort[0] != "-L61sX86hsGw4g1wNvKq" and cohort[0] != "-L6pTo-0a0LlP87H2Tir":
      cohortSchoolStudents[cohortsKey[cohort[0]]] = {}
      for school in cohort[1].values():
        cohortSchoolStudents[cohortsKey[cohort[0]]][school['name']] = school['participants']
        
  return cohortSchoolStudents
        
# Number of solutions submitted per week
def weeklysubmissions(file1, file2, file3, file4):
  #file1,allEvents;file2,courseMembers.json;file3,cohortCourses.json;file4,cohorts.json
  weekly = separatelogs(file1)
  courseMembers = get_dict_from_file(file2)
  cohortCourses =  get_dict_from_file(file3)
  cohort_data = get_dict_from_file(file4)
  d = {} 
  for course in courseMembers:
    for member in courseMembers[course]:
      d[member] = course
  weekno = 7
  signins = {}
  schoolsignins = {}
    
  for cohort in cohort_data:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      schoolsignins[cohort_data[cohort]['name']] = {}
  schoolsignins['BT3103'] = {}
  for cohort in cohortCourses:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
        for index in range(7,13):
          schoolsignins['BT3103'][index] = 0
          schoolsignins[cohort_data[cohort]['name']][index]= 0
  for week in weekly:
    for log in week:
      if 'type' in week[log]:
        if week[log]['type'] == 'ASSIGNMENT_SOLUTION_SUCCESS':
          if week[log]['uid'] in d:
            cohort = getschoolcohort(d[week[log]['uid']], file3, file4)
            if cohort in schoolsignins:
              schoolsignins[cohort][weekno] +=1
    weekno+=1
  return schoolsignins
  
# Getting how active instructors use Achievements app to post assignments
def getinstructoractivity(file1, file2, file3):
  #file1,allEvents;file2,courseMembers.json;file3,users.json
  weekly = separatelogs(file1)
  courseMembers = get_dict_from_file(file2)
  weekno = 7
  solutions = {}
  for index in range(7,13):
    solutions[index] = 0
  
  instruct = {}
  users = get_dict_from_file(file3)
  for week in weekly:
    for log in week:
      if 'type' in week[log]:
        if week[log]['type'] == "ASSIGNMENT_ADD_SUCCESS":
          if users[week[log]['uid']]['displayName'] not in instruct:
            instruct[users[week[log]['uid']]['displayName']] = solutions.copy()
          else:
            instruct[users[week[log]['uid']]['displayName']][weekno] += 1
    weekno+=1
  return instruct

def convertschool(schoolid, file1):
  cohortCourses_data = get_dict_from_file(file1)
  for cohort in cohortCourses_data:
    if schoolid in cohortCourses_data[cohort]:
      return cohortCourses_data[cohort][schoolid]['name']
  return 'BT3103'
  
def getschoolcohort(schoolid, file1, file2):
  cohortCourses_data = get_dict_from_file(file1)
  cohort_data = get_dict_from_file(file2)
  for cohort in cohortCourses_data:
    if schoolid in cohortCourses_data[cohort]:
      return cohort_data[cohort]['name']
  return 'BT3103'
  
# Getting schools with 0 solutions  
def inactiveschools(file1, file2, file3, file4):
  #file1,allEvents;file2,courseMembers.json;file3,cohortCourses.json;file4,cohorts.json
  weekly = separatelogs(file1)
  courseMembers = get_dict_from_file(file2)
  cohortCourses =  get_dict_from_file(file3)
  cohort_data = get_dict_from_file(file4)
  d = {} 
  for course in courseMembers:
    for member in courseMembers[course]:
      d[member] = course
  signins = {}
  schoolsignins = {}
    
  for cohort in cohort_data:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      schoolsignins[cohort_data[cohort]['name']] = {}
  for cohort in cohortCourses:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]:
      for school in cohortCourses[cohort]:
        schoolsignins[cohort_data[cohort]['name']][cohortCourses[cohort][school]['name']] = {}
        for index in range(7,13):
          schoolsignins[cohort_data[cohort]['name']][cohortCourses[cohort][school]['name']][12]= 0

  for log in weekly[-1]:
    if 'type' in weekly[-1][log]:
      if weekly[-1][log]['type'] == 'ASSIGNMENT_SOLUTION_SUCCESS':
          if weekly[-1][log]['uid'] in d:
            school = convertschool(d[weekly[-1][log]['uid']],file3)
            cohort = getschoolcohort(d[weekly[-1][log]['uid']],file3,file4)
            if cohort in schoolsignins:
              if school not in schoolsignins[cohort]:
                schoolsignins[cohort][school] = {}
              if 12 in schoolsignins[cohort][school]:
                schoolsignins[cohort][school][12] += 1
              else:
                schoolsignins[cohort][school][12] = 1
  inactive = {}
  for cohort in schoolsignins:
    inactive[cohort] = []
    for school in schoolsignins[cohort]:
      if schoolsignins[cohort][school][12] == 0:
        inactive[cohort].append(school)
  return inactive
  
def admin_contact(file1, file2, file3):
  #file1,cohorts.json;file2,cohortCourses.json;file3,courses.json
  cohort_data = get_dict_from_file(file1)
  cohortCourses =  get_dict_from_file(file2)
  courses = get_dict_from_file(file3)
  schoolinfo = {}
  for cohort in cohort_data:
    if cohort not in ["-L61sLrUjhzDEslszAVs","-L61sX86hsGw4g1wNvKq","-L6pTo-0a0LlP87H2Tir"]: 
      schoolinfo[cohort_data[cohort]['name']] = {}
      for school in cohortCourses[cohort]:
        if school in uidAndEmail:
          schoolinfo[cohort_data[cohort]['name']][courses[school]['name']]= {}
          schoolinfo[cohort_data[cohort]['name']][courses[school]['name']]['instructor'] = courses[school]['instructorName']
          schoolinfo[cohort_data[cohort]['name']][courses[school]['name']]['email'] = uidAndEmail[school]
          schoolinfo[cohort_data[cohort]['name']][courses[school]['name']]['contact no.'] = str(randint(8,9)) + str(randint(0,9)) + str(randint(0,9)) + str(randint(0,9)) + str(randint(0,9)) + str(randint(0,9)) + str(randint(0,9)) + str(randint(0,9)) 
  return schoolinfo
