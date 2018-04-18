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

# Import General Functions
from general_functions import targetlevel, objectives, uidAndEmail, download_file, get_dict_from_file, get_admin, percentile, flatten_cohortCourses, create_student_array, add_name_to_student, add_school_to_student, add_achievements_lastactive_to_student, add_cohort_id_to_student, sort_all_students_by_sch, returnName

# Import Administrator Functions
from admin_functions import separatelogs, convertschool, getschoolcohort, get_signin_number, get_signup_number, get_total_no_school, get_total_students_per_sch, weeklysubmissions, getinstructoractivity, convertschool, getschoolcohort, inactiveschools, admin_contact

# Import Instructor Functions
from instructor_functions import get_student_ingame_info, get_all_schools_performance, get_student_overall_performance, analyze, findMax, getPauseStats, clean_cohortCourses, getAverageTimingsByStudents, getAverageTimeLevels, topthreeflaggedlevels, weakerstudents, whodis, realname, getvideoStats, numberOfStudentsInSchool

# Import Student Functions
from student_functions import get_studentAchieve, update_five_number_summary, update_all_logs, get_cohort, get_student_20_level_performance, get_pastPerformance, student_function2, achievement_percentile, student_flagged_levels, get_completed_levels_stats, whodis, getUnwatchedCount, sub_function_for_studentCC_status, student_percentile_all_levels
               
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

#####################################################################################################################################################
# AWS Lambda function
def lambda_handler(event, context):
  # Replace this with your firebase project
  firebaseProject = "https://analytics007-7d4bc.firebaseio.com/"
  url = firebaseProject+"/temp.json"
  token = "team7_living"
  
  # If a userID was passed in via the URL, use that userID. 
  queryStringParameters = event.get('queryStringParameters',{})
  print(queryStringParameters)
  if queryStringParameters and "uid" in queryStringParameters and "role" in queryStringParameters:
    print("here")
    newUser = queryStringParameters['uid']
    roleDeclared = queryStringParameters['role']
    print(newUser)
    print(roleDeclared)
  
  # This is a list of all the current api options
  apiOptions = ["users","courseMembers","cohortCourses","cohorts","courses","solutions"]
  
  for filename in apiOptions:
    download_file(token,filename)
  
  userName = returnName(newUser, "/tmp/users.json", "/tmp/cohortCourses.json", "/tmp/cohorts.json")
  userNameRoute = firebaseProject+"/userName.json"
  requests.delete(url=userNameRoute)
  newLogin = {"name": userName}
  nameUrl = firebaseProject+"/userName.json"
  requests.put(url=nameUrl, data=json.dumps(newLogin))
    
  # Getting userAchievements data from firebase
  resp = requests.get("https://analytics-project-89af3.firebaseio.com/userAchievements.json")
  userAchievements = json.loads(resp.text)
  
  """Instructor's output"""
  # Array to store all schools 
  all_sch = flatten_cohortCourses("/tmp/courseMembers.json", "/tmp/users.json", "/tmp/cohortCourses.json")
  
  # Dictionary of all admins
  all_admins = get_admin("/tmp/cohorts.json")
  # Array of all students registered
  all_students = []
  # Array of students with no name registered
  users_with_no_name = []
  
  create_student_array("/tmp/courseMembers.json", all_students)
  add_name_to_student("/tmp/users.json", all_students, users_with_no_name)
  add_school_to_student(all_students, all_sch)
  add_achievements_lastactive_to_student(all_students, userAchievements)

  # Dictionary of students sorted by school
  student_dict = sort_all_students_by_sch(all_students, all_sch)
  
  add_cohort_id_to_student("/tmp/cohortCourses.json", student_dict)

  # Dictionary of cohorts as key and values are dictionary of levels that store 5 number summary as values
  cohortstats = {"-L60lMb7QBWxMsd0aIHE":{}, "-L60nbB_SwQIdvjEEIp7":{}, "-L60ng0QZnIUq5u3w3kU":{}} 
  levelstats = {"-L60lMb7QBWxMsd0aIHE":{}, "-L60nbB_SwQIdvjEEIp7":{}, "-L60ng0QZnIUq5u3w3kU":{}}
  # Dictionary of cohorts as key and values are list of 20 levels (which is also a list) that stores every student's playtime in that level
  overallstats = {}
  
  # Getting userAchievements data from firebase
  resp2 = requests.get("https://analytics007-7d4bc.firebaseio.com/allEvents.json")
  allEvents = json.loads(resp2.text)
  achievements_dict = {}
  update_all_logs(allEvents, achievements_dict)
  update_five_number_summary(cohortstats, overallstats, all_students, achievements_dict)
  sub_function_for_studentCC_status(levelstats, all_students, achievements_dict)
  
  # Getting liveData from firebase
  resp3 = requests.get("https://analytics007-7d4bc.firebaseio.com/liveData.json")
  liveData = json.loads(resp3.text)
  
  # Getting predicted timings
  resp4 = requests.get("https://analytics007-7d4bc.firebaseio.com/predictedlevels.json")
  predictedTimings = json.loads(resp4.text)
  
  # Push and update firebase user ids, for authentication when user logins
  all_admin_id = []
  for i in all_admins:
    for identity in all_admins[i][1]:
      if identity not in all_admin_id:
        all_admin_id.append(identity)
  all_student_id = [student.get_uid() for student in all_students]
  all_school_id = []
  for student in all_students:
    if (student.get_sch_id() not in all_school_id):
      all_school_id.append(student.get_sch_id())
  
  instructor_authenticateUrl = firebaseProject+"/authentication/instructorID.json"
  student_authenticateUrl = firebaseProject+"/authentication/studentID.json"
  requests.put(url=instructor_authenticateUrl, data=json.dumps(all_school_id))
  requests.put(url=student_authenticateUrl, data=json.dumps(all_student_id))
  
  print("user!")
  print(newUser)
  print("role!")
  print(roleDeclared)
  print(type(roleDeclared))
  result = {}
  # Checking for identity of administrator
  if ((str(roleDeclared) == '1') and (newUser in all_admin_id)):
    sign_in_data = get_signin_number(allEvents, "/tmp/courseMembers.json", "/tmp/cohortCourses.json", "/tmp/cohorts.json")
    sign_up_data = get_signup_number(allEvents, "/tmp/courseMembers.json", "/tmp/cohortCourses.json", "/tmp/cohorts.json")
    total_no_school = get_total_no_school("/tmp/cohorts.json", "/tmp/cohortCourses.json")
    total_students_per_sch = get_total_students_per_sch("/tmp/cohorts.json",  "/tmp/cohortCourses.json", "/tmp/courses.json", "/tmp/courseMembers.json")
    weekly_submits =  weeklysubmissions(allEvents, "/tmp/courseMembers.json", "/tmp/cohortCourses.json", "/tmp/cohorts.json")
    instructor_activity = getinstructoractivity(allEvents, "/tmp/courseMembers.json", "/tmp/users.json")
    inactive_schools = inactiveschools(allEvents, "/tmp/courseMembers.json", "/tmp/cohortCourses.json", "/tmp/cohorts.json")
    instructor_contacts = admin_contact("/tmp/cohorts.json", "/tmp/cohortCourses.json", "/tmp/courses.json")
    
    schoolsInstructorRoute = firebaseProject+"/adminInfo/schoolsInstructor.json"
    requests.delete(url=schoolsInstructorRoute)
    for cohort in instructor_contacts:
      schCount = 1
      for sch in instructor_contacts[cohort]:
        newSchool = {"school": sch,
                    "contactNumber": instructor_contacts[cohort][sch]['contact no.'],
                    "instructorName": instructor_contacts[cohort][sch]['instructor'],
                    "email": instructor_contacts[cohort][sch]['email']}
        newUrl = firebaseProject+"/adminInfo/schoolsInstructor/"+cohort+"/"+str(schCount)+".json"
        requests.put(url=newUrl, data=json.dumps(newSchool))
        schCount+=1
    
    inactiveSchoolsRoute = firebaseProject+"/adminInfo/inactiveSchools.json"
    requests.delete(url=inactiveSchoolsRoute)
    for cohort in inactive_schools:
      schCount = 1
      for sch in inactive_schools[cohort]:
        newSchool = {"school": sch}
        newUrl = firebaseProject+"/adminInfo/inactiveSchools/"+cohort+"/"+str(schCount)+".json"
        requests.put(url=newUrl, data=json.dumps(newSchool))
        schCount+=1
    
    weeklyPostingRoute = firebaseProject+"/adminInfo/instructorActivity.json"
    requests.delete(url=weeklyPostingRoute)
    for instruct in instructor_activity:
      for wk in instructor_activity[instruct]:
        newPosting = {"postingCount": instructor_activity[instruct][wk]}
        newUrl = firebaseProject+"/adminInfo/instructorActivity/"+instruct+"/"+str(wk)+".json"
        requests.put(url=newUrl, data=json.dumps(newPosting))

    weeklySubmitsRoute = firebaseProject+"/adminInfo/weeklySubmits.json"
    requests.delete(url=weeklySubmitsRoute)
    for cohort in weekly_submits:
      for week in weekly_submits[cohort]:
        newWeekly = {"submissionsCount": weekly_submits[cohort][week]}
        newUrl = firebaseProject+"/adminInfo/weeklySubmits/"+cohort+"/"+str(week)+".json"
        requests.put(url=newUrl, data=json.dumps(newWeekly))
    
    totalSchoolsRoute = firebaseProject+"/adminInfo/staticInfo.json"
    requests.delete(url=totalSchoolsRoute)
    allSchoolsStatic = {"totalCount": total_no_school[0],
                        "primaryCount": total_no_school[1]['2018 National Coding Championships - Primary'],
                        "juniorCount": total_no_school[1]['2018 National Coding Championships - Junior'],
                        "seniorCount": total_no_school[1]['2018 National Coding Championships - Senior']}
    newUrl = firebaseProject+"/adminInfo/staticInfo.json"
    requests.put(url=newUrl, data=json.dumps(allSchoolsStatic))
    
    studentsPerSchoolRoute = firebaseProject+"/adminInfo/studentsPerSchool.json"
    requests.delete(url=studentsPerSchoolRoute)
    for cohort in total_students_per_sch:
      schoolInCohortCount = 1
      for school in total_students_per_sch[cohort]:
        newSchoolData = {"schoolName": school,
                        "studentCount": total_students_per_sch[cohort][school]}
        newUrl = firebaseProject+"/adminInfo/studentsPerSchool/"+cohort+"/"+str(schoolInCohortCount)+".json"
        requests.put(url=newUrl, 
                          data=json.dumps(newSchoolData))
        schoolInCohortCount+=1
    
    signupRateRoute = firebaseProject+"/adminInfo/signUpRate.json"
    requests.delete(url=signupRateRoute)
    for cohort in sign_up_data:
      for sch in sign_up_data[cohort]:
        signupCount = 1
        for week in sign_up_data[cohort][sch]:
          newSignUp = {"week": week,
                       "signups": sign_up_data[cohort][sch][week]}
          newUrl = firebaseProject+"/adminInfo/signUpRate/"+cohort+"/"+sch+"/"+str(signupCount)+".json"
          requests.put(url=newUrl, 
                            data=json.dumps(newSignUp))
          signupCount+=1
    
    signinRateRoute = firebaseProject+"/adminInfo/signInRate.json"
    requests.delete(url=signinRateRoute)
    for cohort in sign_in_data:
      for sch in sign_in_data[cohort]:
        signinCount = 1
        for week in sign_in_data[cohort][sch]:
          newSignIn = {"week": week,
                       "signins": sign_in_data[cohort][sch][week]}
          newUrl = firebaseProject+"/adminInfo/signInRate/"+cohort+"/"+sch+"/"+str(signinCount)+".json"
          requests.put(url=newUrl, 
                            data=json.dumps(newSignIn))
          signinCount+=1
    
    # Get data using python requests
    resp = requests.get(url=url)
    data = json.loads(resp.text)
    print("Data after update", data)
    
    result = {
    "isBase64Encoded": False,
    "statusCode": 200,
    "headers": {},
    "body": json.dumps({"message": "Successfully updated administrator info"})
    }
  # Checking for identity of instructor
  elif ((str(roleDeclared) == '2') and (newUser in all_school_id)):
    print("entered here")
    student_info = get_student_ingame_info(newUser, "/tmp/courseMembers.json", "/tmp/users.json", userAchievements)
    schools_perf = get_all_schools_performance(newUser, student_info, "/tmp/cohortCourses.json", "/tmp/courseMembers.json", "/tmp/users.json", userAchievements)
    student_overall_perf = get_student_overall_performance(newUser, "/tmp/courseMembers.json", "/tmp/users.json", allEvents)
    schools_time_level_correlation = getAverageTimeLevels(newUser, "/tmp/courseMembers.json", "/tmp/cohortCourses.json", liveData, "/tmp/users.json")
    videoIDs = ["-L8PEzVB0fRyhmQAOBx1", "-L8Gz-q54aVyOc3icUgO", "-L8H-0i0w2y8TTccE6T2", "-L8H-we7JsrUikMrESh5", "-L8H0WhmBwqjY3FHlkv8"]
    videoPauseStats = [{video: getPauseStats(video, "/tmp/solutions.json")} for video in videoIDs]
    top3_failed_levels = topthreeflaggedlevels(newUser, "/tmp/courseMembers.json", "/tmp/users.json", achievements_dict, overallstats, all_students)
    weaker_students = weakerstudents(newUser, "/tmp/courseMembers.json", "/tmp/users.json", overallstats, all_students, achievements_dict)
    #video_status = getvideoStats(newUser, "/tmp/users.json", "/tmp/solutions.json")
    student_count = numberOfStudentsInSchool(newUser, "/tmp/cohortCourses.json")
    
    studentCountRoute = firebaseProject+"/instructorInfo/studentCount.json"
    requests.delete(url=studentCountRoute)
    currentCount = {"count": student_count}
    newUrl = firebaseProject+"/instructorInfo/studentCount.json"
    requests.put(url=newUrl, data=json.dumps(currentCount))
    
    """videoStatusRoute = firebaseProject+"/instructorInfo/videoStatus.json"
    requests.delete(url=videoStatusRoute)
    videoCount = 1
    # Adding into firebase
    for vid in video_status:
      newVideo = {"videoName": video_status[vid]['videoname'],
                  "flaggedStudents": video_status[vid]['studentnames']}
      newUrl = firebaseProject+"/instructorInfo/videoStatus/"+str(videoCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newVideo))
      videoCount+=1"""
    
    weakerStudentsRoute = firebaseProject+"/instructorInfo/weakerStudents.json"
    requests.delete(url=weakerStudentsRoute)
    weakerStudentCount = 1
    # Adding into firebase
    for student in weaker_students:
      newWeakerStudent = {"studentName": student,
                       "failedCount": weaker_students[student]['failed'],
                        "failedLevels": weaker_students[student]['failed levels']}
      newUrl = firebaseProject+"/instructorInfo/weakerStudents/"+str(weakerStudentCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newWeakerStudent))
      weakerStudentCount+=1
    
    mostFailedRoute = firebaseProject+"/instructorInfo/mostFailed.json"
    requests.delete(url=mostFailedRoute)
    topFailedCount = 1
    # Adding into firebase
    for level in range(len(top3_failed_levels)):
      newFailedLevel = {"levelName": top3_failed_levels[level]['level'],
                       "failedCount": top3_failed_levels[level]['No. students failed'],
                        "topic": top3_failed_levels[level]['topic']}
      newUrl = firebaseProject+"/instructorInfo/mostFailed/"+str(topFailedCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newFailedLevel))
      topFailedCount+=1
    
    # Getting students only from selected school (user input)
    student_info_by_user = student_dict[newUser]
    # Deleting previous records
    studentTableRoute = firebaseProject+"/instructorInfo/studentTable.json"
    requests.delete(url=studentTableRoute)
    count = 1
    # Adding into firebase
    for student in student_info_by_user:
      newStudent = {"studentNumber": count,
                   "studentName": student.get_name(),
                   "studentID": student.get_uid(),
                   "studentSchool": student.get_school(),
                   "studentCohort": student.get_cohort_id(),
                   "studentPhotoLink": student.get_photo(),
                   "studentCompleted": student.get_achievements(),
                   "studentLastActive": student.get_lastactive()}
      newUrl = firebaseProject+"/instructorInfo/studentTable/"+str(count)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newStudent))
      count+=1
    
    schoolCurrentProgressRoute = firebaseProject+"/instructorInfo/schoolProgress.json"
    requests.delete(url=schoolCurrentProgressRoute)
    schoolProgressCount = 1
    for school in schools_time_level_correlation:
      newSchoolProgress = {"schoolName": school,
                            "schoolTiming": schools_time_level_correlation[school]['avgTimeSpent'],
                            "schoolLevels": schools_time_level_correlation[school]['avgLevels']}
      newUrl = firebaseProject+"/instructorInfo/schoolProgress/"+str(schoolProgressCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newSchoolProgress))
      schoolProgressCount+=1
    
    studentCurrentProgressRoute = firebaseProject+"/instructorInfo/studentProgress.json"
    requests.delete(url=studentCurrentProgressRoute)
    progressCount = 1
    for student in student_info:
      newStudentProgress = {"studentName": student_info[student]['name'],
                           "studentLevel": student_info[student]['level'],
                           "studentGameID": student_info[student]['gameid']}
      newUrl = firebaseProject+"/instructorInfo/studentProgress/"+str(progressCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newStudentProgress))
      progressCount+=1
    
    studentOverallPerfRoute = firebaseProject+"/instructorInfo/studentOverall.json"
    requests.delete(url=studentOverallPerfRoute)
    overallCount = 1
    for student in student_overall_perf:
      newStudentOverall = {"studentName": student_overall_perf[student]['name'],
                           "studentLevel": student_overall_perf[student]['completed levels'],
                           "studentGameID": student_overall_perf[student]['gameid'],
                           "averageTiming": student_overall_perf[student]['time per level'],
                           "totalTimeSpent": student_overall_perf[student]['total time']}
      newUrl = firebaseProject+"/instructorInfo/studentOverall/"+str(overallCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newStudentOverall))
      overallCount+=1
    
    schoolPerformanceRoute = firebaseProject+"/instructorInfo/schoolPerformance.json"
    requests.delete(url=schoolPerformanceRoute)
    schoolCount = 1
    for sch in schools_perf:
      newSchool = {"schoolID": sch,
                   "schoolName": schools_perf[sch]['name'],
                   "schoolAverageTime": schools_perf[sch]['avgtime']}
      newUrl = firebaseProject+"/instructorInfo/schoolPerformance/"+str(schoolCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newSchool))
      schoolCount+=1
    
    videoPauseRoute = firebaseProject+"/instructorInfo/videoPause.json"
    requests.delete(url=videoPauseRoute)
    # videoPauseStats is a list of dictionaries
    for video in range(len(videoPauseStats)):
      # videoPauseStats[video] is a dictionary
      for key in videoPauseStats[video]:
        pauseCount = 1
        for interval in videoPauseStats[video][key]:
          newPauseInterval = {"videoInterval": interval,
                             "pauseCount": videoPauseStats[video][key][interval]}
          newUrl = firebaseProject+"/instructorInfo/videoPause/"+key+"/"+str(pauseCount)+".json"
          requests.put(url=newUrl, 
                            data=json.dumps(newPauseInterval))
          pauseCount+=1
      
    # Get data using python requests
    resp = requests.get(url=url)
    data = json.loads(resp.text)
    print("Data after update", data)
    
    result = {
    "isBase64Encoded": False,
    "statusCode": 200,
    "headers": {},
    "body": json.dumps({"message": "Successfully updated instructor info"})
    }
  # Checking for identity of student
  elif ((str(roleDeclared) == '3') and (newUser in all_student_id)):
    # Getting latest articles, unable to work due to inability to import BeautifulSoup
    """
    url_1 = 'https://medium.com/topic/javascript'
    url_2 = 'https://medium.com/topic/technology'
    js_articles = get_website_element(url_1)
    jsArticlesRoute = firebaseProject+"/studentInfo/articles/js.json"
    requests.delete(url=jsArticlesRoute)
    jsCount = 1
    for article in range(3):
      newJsArticle = {"title": js_articles[article][0],
                      "url": js_articles[article][1],
                      "summary": js_articles[article][2]}
      newUrl = firebaseProject+"/studentInfo/articles/js/"+str(jsCount)+".json"
      requests.put(url=newUrl, data=json.dumps(newJsArticle))
      jsCount+=1                
    """
    
    # Getting dictionary with level name, level no. and predicted time
    personalPrediction = predictedTimings[newUser]
    nextLevelPredictionRoute = firebaseProject+"/studentInfo/predictedTimings.json"
    requests.delete(url=nextLevelPredictionRoute)
    newPrediction = {"levelName": personalPrediction['level name'], 
                      "levelNumber": personalPrediction['next level'],
                      "predictedTime": personalPrediction['predicted time']}
    newUrl = firebaseProject+"/studentInfo/predictedTimings.json"
    requests.put(url=newUrl, data=json.dumps(newPrediction))
    
    personalProgress = student_percentile_all_levels(newUser, levelstats, all_students, achievements_dict)
    personalProgressRoute = firebaseProject+"/studentInfo/personalProgress.json"
    requests.delete(url=personalProgressRoute)
    for level in personalProgress:
      newProgress = {"levelName": level,
                    "timeTaken": personalProgress[level]['time taken'],
                    "percentile": personalProgress[level]['percentile']}
      newUrl = firebaseProject+"/studentInfo/personalProgress/"+level+".json"
      requests.put(url=newUrl, 
                          data=json.dumps(newProgress))
    
    levelCount = 1
    # Gets all levels a student has completed, with time taken and date
    all_completed_levels_stat = get_studentAchieve(newUser, achievements_dict)
    studentCodeCombatRoute = firebaseProject+"/studentInfo/codeCombat.json"
    requests.delete(url=studentCodeCombatRoute)
    
    for level in all_completed_levels_stat:
      for key in all_completed_levels_stat[level]:
        newLevel = {"LevelName": level,
                     "CompletedDate": key,
                     "timeTaken": all_completed_levels_stat[level][key][0],
                     "clearedStatus": all_completed_levels_stat[level][key][1]}
        newUrl = firebaseProject+"/studentInfo/codeCombat/"+str(levelCount)+".json"
        requests.put(url=newUrl, 
                          data=json.dumps(newLevel))
        levelCount+=1
    
    # Getting student's 20 levels performance in relation to his/her peers
    student_cohort = get_cohort(newUser, all_students)
    student_timings = get_student_20_level_performance(newUser, achievements_dict, all_students, cohortstats)
    
    studentPerformanceRoute = firebaseProject+"/studentInfo/levelTimings.json"
    requests.delete(url=studentPerformanceRoute)
    timingLevelCount = 1
    for level in student_timings:
      if ('self' in student_timings[level]):
        newLevelTiming = {"levelNumber": level,
                         "25thPercentile": student_timings[level]['25th'],
                         "75thPercentile": student_timings[level]['75th'],
                         "maxTiming": student_timings[level]['max'],
                         "minTiming": student_timings[level]['min'],
                         "medianTiming": student_timings[level]['median'],
                         "personalTiming": student_timings[level]['self']}
      else:
        newLevelTiming = {"levelNumber": level,
                         "25thPercentile": student_timings[level]['25th'],
                         "75thPercentile": student_timings[level]['75th'],
                         "maxTiming": student_timings[level]['max'],
                         "minTiming": student_timings[level]['min'],
                         "medianTiming": student_timings[level]['median'],
                         "personalTiming": "No attempts yet"}
      newUrl = firebaseProject+"/studentInfo/levelTimings/"+str(timingLevelCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newLevelTiming))
      timingLevelCount+=1
    
    # Getting student past performance for 20 levels
    pastPerformance = get_pastPerformance(newUser, achievements_dict, overallstats, all_students)
    pastPerformanceRoute = firebaseProject+"/studentInfo/pastPerformance.json"
    requests.delete(url=pastPerformanceRoute)
    
    performanceLevelCount = 1
    for level in pastPerformance:
      pastPerformanceTiming = {"levelNumber": level,
                              "timeTaken": pastPerformance[level]}
      newUrl = firebaseProject+"/studentInfo/pastPerformance/"+str(performanceLevelCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(pastPerformanceTiming))
      performanceLevelCount+=1
    
    # Getting student's flagged levels
    flaggedLevels = student_flagged_levels(newUser, achievements_dict, overallstats, all_students)
    flaggedLevelsRoute = firebaseProject+"/studentInfo/flaggedLevels.json"
    requests.delete(url=flaggedLevelsRoute)
    flaggedLevelsCount = 1
    for level in range(len(flaggedLevels)):
      newFlaggedLevel = {"levelNumber": flaggedLevels[level]['level'],
                        "levelName": flaggedLevels[level]['name'],
                        "levelPercentile": flaggedLevels[level]['percentile'],
                        "levelTopic": flaggedLevels[level]['topic'],
                        "enrichmentLink": flaggedLevels[level]['w3 link']}
      newUrl = firebaseProject+"/studentInfo/flaggedLevels/"+str(flaggedLevelsCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newFlaggedLevel))
      flaggedLevelsCount+=1
    
    # Getting number of levels a student has completed per week, compared to his/her peers
    completedLevelStats = get_completed_levels_stats(newUser, allEvents, all_students)
    completedLevelStatsRoute = firebaseProject+"/studentInfo/completedLevelStats.json"
    requests.delete(url=completedLevelStatsRoute)
    completedCount = 1
    for week in completedLevelStats:
      newCompletedLevel = {"week": week,
                          "cohortCompleted": completedLevelStats[week]['cohort'],
                          "personalCompleted": completedLevelStats[week]['self']}
      newUrl = firebaseProject+"/studentInfo/completedLevelStats/"+str(completedCount)+".json"
      requests.put(url=newUrl, 
                        data=json.dumps(newCompletedLevel))
      completedCount+=1
    
    # Getting static info for student
    achievementPercentile = achievement_percentile(newUser, userAchievements, all_students)
    videoUnwatchedCount = getUnwatchedCount(newUser, "/tmp/solutions.json")
    print(videoUnwatchedCount)
    achievementPercentileRoute = firebaseProject+"/studentInfo/staticInfo.json"
    requests.delete(url=achievementPercentileRoute)
    statCount = 1
    currentStats = {"Cohort average": achievementPercentile['Cohort average'],
                    "Current level": achievementPercentile['Current level'],
                    "Percentile in cohort": achievementPercentile['Percentile in cohort'],
                    "Unwatched Video": videoUnwatchedCount}
    statsUrl = firebaseProject+"/studentInfo/staticInfo/"+str(statCount)+".json"
    requests.put(url=statsUrl, data=json.dumps(currentStats))
    
    # Get data using python requests
    resp = requests.get(url=url)
    data = json.loads(resp.text)
    print("Data after update", data)
    
    result = {
    "isBase64Encoded": False,
    "statusCode": 200,
    "headers": {},
    "body": json.dumps({"message": "Successfully updated student info"})
    }
  """elif ((newUser not in all_student_id) and (newUser not in all_school_id) and (newUser not in all_admin_id)):
    result = {
    "isBase64Encoded": False,
    "statusCode": 502,
    "headers": "no such user",
    "body": json.dumps({"message": "Incorrect credentials, no such user!"})
    }"""
    
  return result
