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
from student_functions import student_function2

# Getting number of students in a school
def numberOfStudentsInSchool(schoolID, file1):
  cohortCourses_data = get_dict_from_file(file1)
  for i in cohortCourses_data.items():
    for j in i[1].items():
      if j[0] == schoolID:
        return j[1]['participants']

# Getting dictionary of students belonging in the school with their names, in-game name and level
def get_student_ingame_info(schoolid, file1, file2, file3):
  courseMember_data = get_dict_from_file(file1)
  user_data = get_dict_from_file(file2)
  userAchievements_data = file3
  studentinfo = {}
  if schoolid in courseMember_data.keys():
    for student in courseMember_data[schoolid]:
      studentinfo[student] = {}
  for student in studentinfo:
    if student in userAchievements_data.keys():
      if student not in user_data.keys() or "displayName" not in user_data[student].keys():
        studentinfo[student]['name'] = "Has not set name"
      else:
        studentinfo[student]['name'] = user_data[student]["displayName"]
      studentinfo[student]['level'] = userAchievements_data[student]["CodeCombat"]["totalAchievements"]
      studentinfo[student]['gameid'] = userAchievements_data[student]["CodeCombat"]["id"]
    else:
      if student not in user_data.keys() or "displayName" not in user_data[student].keys():
        studentinfo[student]['name'] = "Has not set name"
      else:
        studentinfo[student]['name'] = user_data[student]["displayName"]
      studentinfo[student]['level'] = "Has not played CodeCombat"
      studentinfo[student]['gameid'] = "Has not played CodeCombat"
  return studentinfo

# Getting all schools belonging to a cohort, with every school's average and overall average
def get_all_schools_performance(schoolid, studentinfo, file1, file2, file3, file4):
  cohortCourses_data = get_dict_from_file(file1)
  cohortid = ""
  for cohort in cohortCourses_data:
    for school in cohortCourses_data[cohort]:
      if school == schoolid:
        cohortid = cohort
        break
  schoolavg = {}
  entire = 0
  for school in cohortCourses_data[cohortid].items():
    schoolavg[school[0]] = {}
    schoolavg[school[0]]['name'] = school[1]['name']
    studentinfo = get_student_ingame_info(school[0], file2, file3, file4)
    total = 0
    number = 0
    for student in studentinfo.values():
      if student['level'] != "Has not played CodeCombat":
        total += int(student['level'])
        number += 1
    if number != 0:
      schoolavg[school[0]]['avgtime'] = total/number
    else:
      schoolavg[school[0]]['avgtime'] = 0
    if len(studentinfo) != 0:
      entire += schoolavg[school[0]]['avgtime']
  schoolavg['overall'] = {}
  schoolavg['overall']['name'] = 'overall'
  schoolavg['overall']['avgtime'] = entire/len(cohortCourses_data[cohortid])
  return schoolavg
  
# Getting student's individual performance
def get_student_overall_performance(schoolid, file1, file2, file3):
  courseMember_data = get_dict_from_file(file1)
  user_data = get_dict_from_file(file2)
  userAchievements_data = file3
  studentinfo = {}
  if schoolid in courseMember_data.keys():
    for student in courseMember_data[schoolid]:
      studentinfo[student] = {}
  for student in studentinfo:
    if student in userAchievements_data.keys():
      if student not in user_data.keys() or "displayName" not in user_data[student].keys():
        studentinfo[student]['name'] = "Has not set name"
      else:
        studentinfo[student]['name'] = user_data[student]["displayName"]
      totaltime = 0
      levels = get_studentAchieve(student, userAchievements_data)
      for level in levels:
        for info in levels[level]:
          totaltime += levels[level][info][0]
      studentinfo[student]['total time'] = totaltime
      if userAchievements_data[student]["CodeCombat"]["totalAchievements"] == 0:
        studentinfo[student]['completed levels'] = 0
        studentinfo[student]['time per level'] = 0
      else:
        studentinfo[student]['time per level'] = totaltime/userAchievements_data[student]["CodeCombat"]["totalAchievements"]
        studentinfo[student]['completed levels'] = userAchievements_data[student]["CodeCombat"]["totalAchievements"]
      studentinfo[student]['gameid'] = userAchievements_data[student]["CodeCombat"]["id"]
    else:
      if student not in user_data.keys() or "displayName" not in user_data[student].keys():
        studentinfo[student]['name'] = "Has not set name"
      else:
        studentinfo[student]['name'] = user_data[student]["displayName"]
      studentinfo[student]['total time'] = "Has not played CodeCombat"
      studentinfo[student]['time per level'] = "Has not played CodeCombat"
      studentinfo[student]['gameid'] = "Has not played CodeCombat"
      studentinfo[student]['completed levels'] = 0
  return studentinfo

# Getting sorted list of times where people paused the videos
def analyze(video, file1):
  temp = {}
  pause = []
  temp = file1['-L5cmwU2yj2HRmfDvIUP']
  for user in temp: #iterate through users belonging to this cohort of students (aka BT3103)
    if video in temp[user].keys():
      if 'value' in temp[user][video]:
        if 'youtubeEvents' in temp[user][video]['value']:
          temp1 = temp[user][video]['value']['youtubeEvents']
          for e in temp1:
            if 'pause' in temp1[e]['event']: 
              pause.append(round(temp1[e]['videoTime']/10)*10) #eg 195/10 = 19.5, round(19.5)=20, 20*10 = 200

  pause.sort() 
  return pause

# Getting max length of video (but limitation is all students end the video earlier, so the max length won't be accurate)
def findMax(video, file1):
  maxx = []
  temp = file1['-L5cmwU2yj2HRmfDvIUP']
  for user in temp: #iterate through users belonging to this cohort of students (aka BT3103)
    if video in temp[user].keys():
      if 'value' in temp[user][video]:
        if 'youtubeEvents' in temp[user][video]['value']:
          temp1 = temp[user][video]['value']['youtubeEvents']
          for e in temp1:  
              maxx.append(temp1[e]['videoTime'])
  maxx.sort()
  return round(maxx.pop(-1)/10) *10 #rounding up

def getPauseStats(video, file1):
  solutions_file = get_dict_from_file(file1)
  intervals = {} #keys are the time intervals, values are the number of ppl who paused during the interval
  start = [] #list to store the start integers of an interval eg 0, 11, 21, 31...
  end =[]  #list to store the end intergers of an interval eg 10, 20, 30
  maxx = findMax(video, solutions_file) #get the max length of video 
  i = 0
  
  #create the keys of the dictionary
  while i < maxx: 
    if i != 0:
      string = str(i) + " to " + str(i+9)
      start.append(i)
      end.append(i+9)
      intervals[string] = 0
      
      i += 10
    
    elif i == 0:
      string = str(i) + " to " + str(i+10)
      intervals[string] = 0
      start.append(i)
      end.append(i+10)
      i += 11
    
  analyzed = analyze(video, solutions_file) #get the list of all pause times
  l = len(analyzed) 

  for j in range(0, len(analyzed)): #add all the pauses 
    num = analyzed[j]
    x = 0
    for key in intervals.keys(): #check through every key 
      s = start[x] #using index
      e = end[x]
      if s <= num <= e: #if within the range, add to key
        intervals[key] += 1
        break;
      x+=1
  
  return intervals

# Returns a cohortCourses that excludes schools without any participants or progress
def clean_cohortCourses(file): 
  newfile = {}
  for cohort in file:
    newfile[cohort]={}
    for school in file[cohort]:
      if file[cohort][school]['participants'] != 0 or file[cohort][school]['progress'] !=0:
          newfile[cohort][school]= {}
          newfile[cohort][school]['name'] = file[cohort][school]['name']
          newfile[cohort][school]['participants'] = file[cohort][school]['participants']
          newfile[cohort][school]['progress'] = file[cohort][school]['progress']
  newfile.pop('-L6pTo-0a0LlP87H2Tir') # delete test cohort
  return newfile

# Returns average time taken by all students in a school (single number, 1 d.p)
def getAverageTimingsByStudents(schoolid, file1, file2, file3):
  students = []
  courseMember_data = get_dict_from_file(file1)
  cohortCourses_data = get_dict_from_file(file2)
  achievements = file3
  
  if schoolid in courseMember_data.keys():
    for student in courseMember_data[schoolid]:
      students.append(student)
  
  numStudents = len(students)
  for s in students:
    if s not in achievements.keys():
      numStudents -= 1
      students.remove(s)
  totaltime = 0
  for student in achievements:
    if student in students:
      if achievements[student]['CodeCombat']['totalAchievements'] == 0:
        numStudents -= 1
      if 'achievements' in achievements[student]['CodeCombat']:
        for level in achievements[student]['CodeCombat']['achievements']:
          if 'playtime' in achievements[student]['CodeCombat']['achievements'][level]:
            #print(achievements[student]['CodeCombat']['achievements'][level]['playtime'])
            totaltime+= achievements[student]['CodeCombat']['achievements'][level]['playtime']

  return round(((totaltime/ numStudents)/60),1) # in terms of minutes, to one decimal place
  
# Getting average time spent and average levels of each school, tailored to respective cohort
def getAverageTimeLevels(schoolid, file1, file2, file3, file4):
  #file1;courseMember, file2;cohortCourses, file3;allEvents, file4;users
  cohortCourses_data = get_dict_from_file(file2)
  cleanedFile = clean_cohortCourses(get_dict_from_file(file2))  
  user_data = get_dict_from_file(file4)
  averages= {}
  
  cohortID = ""
  for cohort in cohortCourses_data: # from school id, find cohort id 
    for school in cohortCourses_data[cohort]:
      if school == schoolid:
        cohortID = cohort
        break
  
  for school in cleanedFile[cohortID]: 
    totalLvls = 0
    name = cleanedFile[cohortID][school]['name']
    averages[name] = {}
    numStudents = cleanedFile[cohortID][school]['participants']
    temp = get_student_ingame_info(school, file1, file4, file3)
    
    averages[name]['avgTimeSpent'] = getAverageTimingsByStudents(school, file1, file2, file3)
    
    for student in temp:
      if type(temp[student]['level']) is int:
        totalLvls += temp[student]['level']
      if temp[student]['gameid'] == 'Has not played CodeCombat': #exclude those students who didn't play CoCo
        numStudents-= 1 
    
    try:
      averages[name]['avgLevels'] = "{0:0.1f}".format(totalLvls/numStudents) # format to one dp. if u want nearest integer just remove "{0:0.1f}".format() 
    except ZeroDivisionError:
      print(str(totalLvls) + " " + school)
    
  return averages

# Returns array with top 3 levels where students are having difficulty understanding (levels where percentiles < 50)
def topthreeflaggedlevels(schoolid, file1, file2, file3, arr1, file4):
  #file1,courseMembers.json;file2,users.json;file3,achievements_dict;arr1,overallstats;file4,all_students
  courseMember_data = get_dict_from_file(file1)
  user_data = get_dict_from_file(file2)
  levels = {}
  if schoolid not in courseMember_data:
    return 'School not found'
  for student in courseMember_data[schoolid]:
    percentiles = student_function2(student, arr1, file3, file4)
    for level in percentiles:
      if percentiles[level] < 50:
        if level not in levels:
          levels[level] = 1
        else:
          levels[level] += 1
  first = second = third = 0
  for level in levels:
    if levels[level] > third:
      third = level
    if levels[level] > second:
      temp = second
      second = third
      third = temp
    if levels[level] > first:
      temp = first
      first = second
      second = temp
  
  return [{'level' : targetlevel[first - 1], 'No. students failed' : levels[first], 'topic' : objectives[targetlevel[first-1]]['topics']} , {'level' : targetlevel[second - 1], 'No. students failed' : levels[second],'topic' : objectives[targetlevel[second-1]]['topics']},
         {'level' : targetlevel[third - 1] , 'No. students failed' : levels[third],'topic' : objectives[targetlevel[third-1]]['topics']}]
         
# Getting names of students who are scoring 25percentile for 50% of the levels they completed and what levels are they
def weakerstudents(schoolid, file1, file2, arr1, arr2, file3):
  #weaker_students = weakerstudents(newUser, "/tmp/courseMembers.json", "/tmp/users.json", overallstats, all_students, achievements_dict)
  #file1,courseMembers.json;file2,users.json;arr1,overallstat;arr2,allstudents;file3,achievements_dict
  courseMember_data = get_dict_from_file(file1)
  user_data = get_dict_from_file(file2)
  failstudents = {} 
  if schoolid not in courseMember_data:
    return 'School not found'
  for student in courseMember_data[schoolid]:
    percentiles = student_function2(student, arr1, file3, arr2)
    fail = []
    ok = 0
    for percentile in percentiles:
      if  0<percentiles[percentile]<50:
        fail.append(percentile)
      elif percentiles[percentile] > 50:
        ok += 1
    if len(fail) > ok:
      failstudents[user_data[student]['displayName']] = {'failed': len(fail), 'passed': ok, 'failed levels' : []}
      for level in fail:
        failstudents[user_data[student]['displayName']]['failed levels'].append((targetlevel[level-1], objectives[targetlevel[level-1]]['topics']))
  return failstudents
  
def whodis(videoID):
  if videoID == '-L8H-we7JsrUikMrESh5':
    return 'AWS Lambda Lab - Part 4 '
  if videoID == '-L8H0WhmBwqjY3FHlkv8':
    return 'AWS Lambda Lab - Part 5 '
  if videoID == '-L8PEzVB0fRyhmQAOBx1':
    return 'AWS Lambda Lab - Part 1 '
  if videoID == '-L8Gz-q54aVyOc3icUgO':
    return 'AWS Lambda Lab - Part 2 '
  if videoID == '-L8H-0i0w2y8TTccE6T2':
    return 'AWS Lambda Lab - Part 3 '
  if videoID == '-L7gr-AXrwUuurOxT1Pe':
    return 'Introduction to AWS Lambda -Serverless Compute on Amazon Web Services '
  if videoID == '-L7r10yH58UkhyiwxS7t':
    return 'Real Time Charts'

# Getting name using student uid    
def realname(studentIDD, file1):
  #file1,users.json
  user_data=get_dict_from_file(file1)
  students_dict={}
  for x in user_data.items():
    studentID=x[0]
    if studentID == studentIDD:
      for y in x[1:]: #accessing the tuples. taking away studentID
        if ('displayName') in y.keys():
          temp=y['displayName']
          return temp

# Getting video status of students
def getvideoStats(schoolID, file1, file2):
  #file1,users.json;file2,solutions.json
  solutions_data = get_dict_from_file(file2)
  answer={}
  list_of_videos = [] # to store key as videos, and empty value for now, later will be number (percentage of complete)
  for x in solutions_data[schoolID].values():
    for y in x.items():
      videoID =y[0]
      if 'value' in y[1].keys():
         if 'youtubeEvents' in (y[1]['value']): # confirmation that this is a video
          if videoID not in list_of_videos:
            list_of_videos.append(videoID)
  #print (list_of_videos) # list of videos supposedly
  for i in list_of_videos:
    videoname = whodis(i)
    answer[i]={"videoname":videoname,'student names':[]}
  for x in solutions_data[schoolID].items():
    studentID = x[0]
    this_student_completed=[]
    for y in x[1].items():
      videoID=y[0]
      if ('value') in y[1].keys():
        if ('answers') in y[1]['value']:
          this_student_completed.append(videoID) # we have a list of completed videos by this student
    this_student_incompleted=[]
    for i in list_of_videos: # this is the full list
      if i not in this_student_completed:
        this_student_incompleted.append(i)
    #print (this_student_incompleted)
    if len(this_student_incompleted)!=0:
      for i in this_student_incompleted:
        name = realname(studentID, file1)
        answer[i]['student names'].append(name)
  return answer
