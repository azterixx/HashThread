import { Injectable } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
import { PaginatedDto } from './dto/pagintation.dto';

@Injectable()
export class PaginationProvider {

  async aggregatePaginate<T>(
    model: Model<any>,
    basePipeline: PipelineStage[],
    page = 1,
    limit = 10,
  ): Promise<PaginatedDto<T>> {

    const safeLimit = Math.min(Math.max(+limit || 1, 1), 100);

    const safePage = Math.max(+page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const pipeline: PipelineStage[] = [
      ...basePipeline,
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: safeLimit }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [{ items, total }] = await model.aggregate(pipeline).exec();
    const totalItems = total[0]?.count ?? 0;

    return {
      items,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit) || 1,
        currentPage: safePage,
        pageSize: safeLimit,
      },
    };
  }
}