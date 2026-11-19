import {COURSES as FULL_COURSES,LEVELS,PRODUCTS,esc,createReport,verifyCourseData as verifyOriginal} from './curriculum-v14.js';
export {LEVELS,PRODUCTS,esc,createReport,FULL_COURSES};
export const PICKED_QUESTION_INDICES=[0,2,4,6,8];
export const COURSES=FULL_COURSES.map(course=>({...course,q:PICKED_QUESTION_INDICES.map(i=>course.q[i])}));
export function verifyCourseData(){
 verifyOriginal();
 if(COURSES.length!==15||COURSES.some(c=>c.q.length!==5))throw Error('5-question curriculum mismatch');
 return true;
}
