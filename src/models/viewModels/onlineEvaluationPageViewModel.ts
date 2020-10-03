import { form } from '../schemas/form';
import { onlineEvaluation } from '../schemas/onlineEvaluation';
import { submission } from '../schemas/submission';

export class onlineEvaluationPageViewModel{
    formGroups:form[];
    onlineEvaluations:onlineEvaluation[];
    submissions:submission[];
    projectIdList:string[];
}