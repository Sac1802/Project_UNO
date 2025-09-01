import { UsageTrackingRepository } from "../repository/usageTrackingRepository.js";
import { UsageTrackingService } from "../services/usagesTrackingService.js";
import Either from "../utils/Either.js";

const usageTrackingRepo = new UsageTrackingRepository();
const usageTrackingService = new UsageTrackingService(usageTrackingRepo);

export async function  getAllUsages(req, res, next){
    const usages = await usageTrackingService.getAllUsages();
    if(usages.isRight()){
        res.status(201).json({usages: usages.right});
    }else{
        const error = usages.value;
        res.status(error.statusCode || 500).send({
            message: error.message,
            errors: error.errors
        })
    }
}

export async function responseTimes(req, res, next){
    const responseTime = await usageTrackingService.getResponseTimes();
    if(responseTime.isRight()){
        res.status(201).json({responseTime: responseTime.right});
    }else{
        const error = responseTime.value;
        res.status(error.statusCode || 500).send({
            message: error.message,
            errors: error.errors
        })
    }
}

export async function statusCodes(req, res, next){
    const statusCode = await usageTrackingService.getStatusCodes();
    if(statusCode.isRight()){
        res.status(201).json({statusCode: statusCode.right});
    }else{
        const error = statusCode.value;
        res.status(error.statusCode || 500).send({
            message: error.message,
            errors: error.errors
        })
    }
}

export async function topEndpoints(req, res, next){
    const topEndpoint = await usageTrackingService.getTopEndpoints();
    if(topEndpoint.isRight()){
        res.status(201).json({topEndpoint: topEndpoint.right});
    }else{
        const error = topEndpoint.value;
        res.status(error.statusCode || 500).send({
            message: error.message,
            errors: error.errors
        })
    }
}