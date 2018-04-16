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
from admin_functions import separatelogs

# Gets all levels a student has completed, with time taken and date
def get_studentAchieve(uid, achievements_dict):
  d = []
  for key in achievements_dict:
    if achievements_dict[key]['otherActionData_uid'] == uid:
      d.append(achievements_dict[key])
  new = []
  newd = {}
  for level in d:
    if level['otherActionData_levelId'] not in newd:
      new.append(level['otherActionData_levelId'])
      newd[level['otherActionData_levelId']] =  {datetime.datetime.fromtimestamp(
        int(level['createdAt'])/1000).strftime('%Y-%m-%d %H:%M'):(level['otherActionData_playtime'],level['otherActionData_complete']) }
    else:
      if level['otherActionData_playtime'] in newd[level['otherActionData_levelId']].values():
        continue
      else:
        newd[level['otherActionData_levelId']][datetime.datetime.fromtimestamp(
        int(level['createdAt'])/1000).strftime('%Y-%m-%d %H:%M')] = (level['otherActionData_playtime'],level['otherActionData_complete'])
  return newd

# Get five-number summary stats for students
def update_five_number_summary(cohort_dict, overall_dict, all_students, achievements_dict):
  for cohort in cohort_dict:
    targetstats = []
    for index in range(20):
      targetstats.append([])
    for student in all_students:
      if student.get_cohort_id() == cohort:
        levelinfo = get_studentAchieve(student.get_uid(), achievements_dict)
        for index in range(20):
          level = targetlevel[index]
          if level in levelinfo:
            for time in levelinfo[level].items():
              if (time[1][0] < 1000):
                targetstats[index].append(time[1][0])
    for stat in targetstats: 
      stat.sort()
    overall_dict[cohort] = targetstats
    for index in range(20):
      if len(targetstats[index]) == 0 :
        cohort_dict[cohort][index+1] = {'min': 0,
                                    '25th': 0,
                                    'median': 0,
                                    '75th' : 0,
                                    'max' : 0}
      else:
        cohort_dict[cohort][index+1] = {'min': round(percentile(targetstats[index], 0)),
                                    '25th': round(percentile(targetstats[index], 0.25)),
                                    'median': round(percentile(targetstats[index], 0.50)),
                                    '75th' : round(percentile(targetstats[index], 0.75)),
                                    'max' : round(percentile(targetstats[index], 1.00))}

# Getting all student's level information
def sub_function_for_studentCC_status(levelstats, all_students, achievements_dict):
  for cohort in levelstats:
    targetstats = []
    for student in all_students:
      if student.get_cohort_id() == cohort:
        levelinfo = get_studentAchieve(student.get_uid(), achievements_dict)
        for level in levelinfo:
          if level not in levelstats[cohort]:
            levelstats[cohort][level] = []
            for time in levelinfo[level].items():
              levelstats[cohort][level].append(time[1][0])
          else:
            for time in levelinfo[level].items():
              levelstats[cohort][level].append(time[1][0])
    for stat in levelstats[cohort].values(): 
      stat.sort()

# Getting student's performance for all CC levels completed thus far
def student_percentile_all_levels(uid, levelstats, all_students, achievements_dict):
  studentAchieve = get_studentAchieve(uid, achievements_dict)
  cohort = get_cohort(uid, all_students)
  leveldict = {}
  for level in studentAchieve:
    leveldict[level] = {}
    leveldict[level]['percentile'] = round((levelstats[cohort][level].index(min(studentAchieve[level].values())[0])/len(levelstats[cohort][level]))*100,2)
    leveldict[level]['time taken'] = min(studentAchieve[level].values())[0]
  return leveldict

# Getting all achievement logs  
def update_all_logs(file1, achievements_dict):
  #mergedLogs = get_dict_from_file(file1)
  mergedLogs = file1
  for key in mergedLogs:
    if "type" in mergedLogs[key]:
      if mergedLogs[key]['type'] == "UPDATE_ACHIEVEMENTS_DATA":
        achievements_dict[key] = mergedLogs[key]
        
def get_cohort(uid, arr1):
  for student in arr1:
    if uid == student.get_uid():
      return student.get_cohort_id()
      
def get_student_20_level_performance(uid, achievements_dict, all_students, cohortstats):
  studentAchieve = get_studentAchieve(uid, achievements_dict)
  cohort = get_cohort(uid, all_students)
  xcohortstat = cohortstats[cohort].copy()
  for index in range(20):
    if targetlevel[index] in studentAchieve:
      xcohortstat[index+1]['self'] = (min(studentAchieve[targetlevel[index]].values())[0])
  return xcohortstat
  
# Getting students percentile of 20 levels and predicted playtime for upcoming level
def get_pastPerformance(uid, achievements_dict, overallstats, all_students):
  studentAchieve = get_studentAchieve(uid, achievements_dict)
  completed = []
  cohort = get_cohort(uid, all_students)
  cohortstats = overallstats[cohort]
  xpercentile = {}
  for index in range(20):
    level = targetlevel[index]
    if level in studentAchieve:
      completed.append(1)
      xpercentile[index+1] = (cohortstats[index].index(min(studentAchieve[level].values())[0])/len(cohortstats[index]))*100
    else:
      completed.append(0)
      xpercentile[index+1] = 0
  averagepercentile = sum(xpercentile)/len(xpercentile)
  #x = 0
  for index in range(20):
    if completed[19-index] == 1:
      x = 19-index + 1
      break
  #xpercentile[x+1] = (percentile(cohortstats[x], averagepercentile/100))
  return xpercentile
  
# Getting student function2
def student_function2(uid, overallstats, achievements_dict, allstudents):
  studentAchieve = get_studentAchieve(uid, achievements_dict)
  completed = []
  cohort = get_cohort(uid, allstudents)
  if cohort == '':
    return {}
  cohortstats = overallstats[cohort]
  xpercentile = {}
  for index in range(20):
    level = targetlevel[index]
    if level in studentAchieve:
      completed.append(1)
      if min(studentAchieve[level].values())[0] > 1000:
        xpercentile[index+1] = 1
        continue
      xpercentile[index+1] = (cohortstats[index].index(min(studentAchieve[level].values())[0])/len(cohortstats[index]))*100
    else:
      xpercentile[index+1] = 0
      completed.append(0)
  averagepercentile = sum(xpercentile.values())/len(xpercentile)
  for index in range(20):
    if completed[19-index] == 1:
      x = 19-index + 1
      break
  #xpercentile[x+1] = averagepercentile
  return xpercentile
  
# Getting student's percentile for number of achievements completed as compared to cohort, and average level completed for cohort
def achievement_percentile(uid, file1, arr1):
  cohort = get_cohort(uid, arr1)
  achievementsAPI = file1
  levels = []
  currlevel = 'has not played code combat'
  xpercentile = 'has not played code combat'
  for student in arr1:
    if student.get_cohort_id() == cohort and student.get_uid() in achievementsAPI:
      if 'CodeCombat' in achievementsAPI[student.get_uid()]:
        levels.append(achievementsAPI[student.get_uid()]['CodeCombat']['totalAchievements'])
        if student.get_uid() == uid:
          currlevel = achievementsAPI[student.get_uid()]['CodeCombat']['totalAchievements']
  levels.sort()
  if type(currlevel) == int:
    xpercentile = (levels.index(currlevel)/len(levels))*100
  averagelevel = 'no cohort'
  if len(levels) > 0:
    averagelevel = sum(levels)/ len(levels)
  return {'Current level': currlevel, 'Percentile in cohort': xpercentile, 'Cohort average' : averagelevel}
 
# Getting flagged levels of student, if his/her performance fall below 25th percentile  
def student_flagged_levels(uid, file1, arr1, arr2):
  percentiles = get_pastPerformance(uid, file1, arr1, arr2)
  attention = {}
  x = 0
  for level in percentiles:
    x += 1
    if x <= len(percentiles) and 0 < percentiles[level] < 25:
      attention[level] = percentiles[level]
  attentionlist = []
  for level in attention:
    attentionlist.append({'level' : level, 'name' : targetlevel[level-1], 'percentile': percentiles[level], 'topic': objectives[targetlevel[level-1]]['topics'],'w3 link': objectives[targetlevel[level-1]]})
  return attentionlist
  
# Getting number of levels completed in comparison to student's peers
def get_completed_levels_stats(uid, file1, arr1):
  cohort = get_cohort(uid, arr1)
  week_logs = separatelogs(file1)
  cohort_levels = {}
  weekno = 7
  for week in week_logs:
    total_levels = 0
    individual_levels = 0
    students = []
    for log in week:
      if week[log]['type'] ==  "UPDATE_ACHIEVEMENTS_DATA":
        if get_cohort(week[log]['otherActionData']['uid'], arr1) == cohort:
          if week[log]['otherActionData']['uid'] == uid:
            individual_levels += 1
          if week[log]['otherActionData']['uid'] not in students:
            students.append(week[log]['otherActionData']['uid'])
          total_levels += 1
    if len(students) == 0:
      cohort_levels[weekno] = {'self': individual_levels, 'cohort' : total_levels}
    else:
      cohort_levels[weekno] = {'self': individual_levels, 'cohort' : total_levels/len(students)}
    weekno += 1
  return cohort_levels

# Getting video titles for video assignments posted  
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
#L8H0WhmBwqjY3FHlkv8 --> fifth video of week 8
#L8PEzVB0fRyhmQAOBx1 --> first video of week 8
#L8Gz-q54aVyOc3icUgO --> second video of week 8
#L8H-0i0w2y8TTccE6T2 --> third video of week 8
#L7gr-AXrwUuurOxT1Pe --> first video of week 7
#L7r10yH58UkhyiwxS7t --> second video of week 7

# Printing statement
def getUnwatchedCount(studentID, file1):
  solutions_data = get_dict_from_file(file1)
  cumulative_list_of_videos = [] # to store key as videos
  for x in solutions_data.items():
    schoolID = x[0]
    if studentID in x[1].keys():
      for y in x[1].values():
        for z in y.items():
          videoID = z[0]
          if 'value' in z[1].keys():
            if 'youtubeEvents' in z[1]['value']:
              if videoID not in cumulative_list_of_videos:
                cumulative_list_of_videos.append(videoID)
  #print(cumulative_list_of_videos) store of all cumulative videos 
  videos_watched_by_student=[]
  for x in solutions_data.items():
    for y in x[1].keys():
      if y ==studentID:
        for z in x[1][y].items():
          thisvideo=z[0]
          if 'value' in z[1].keys():
            if 'answers' in z[1]['value']:
              videos_watched_by_student.append(thisvideo)
  #print (videos_watched_by_student) cumulative videos watched by particular student
  list_of_unwatched=[]
  for i in cumulative_list_of_videos:
    if i not in videos_watched_by_student:
      list_of_unwatched.append(i)
  #print (list_of_unwatched) #list of unwatched by this student
  numberOfUnwatched=len(list_of_unwatched)
  weeknumbers=[]
  for i in list_of_unwatched:
    hehe = i[2]
    if hehe not in weeknumbers:
      weeknumbers.append(hehe)
    stringy=''
  if len(weeknumbers)!=0:
    for i in weeknumbers[:-1]:
      stringy+=i
      stringy+=", "
    stringy+=weeknumbers[-1]
  else:
    stringy = "0"
    #print (stringy)
  #print (weeknumbers)
  list_of_video_names=[]
  for i in list_of_unwatched:
    list_of_video_names.append(whodis(i))
  #print (list_of_video_names)
  stringnames = ''
  if len(weeknumbers)!=0:
    for i in list_of_video_names[:-1]:
      stringnames+=i
      stringnames+=", "
    stringnames+=list_of_video_names[-1]
  final = 'You have ' + str(numberOfUnwatched) + " videos incompleted"
  if numberOfUnwatched == 0:
    final+=". "
  else:
    final += " from Weeks(s) " + stringy + ". They are " + stringnames+ "." 
  return final
