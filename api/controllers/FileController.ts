import handler from '../../libs/handler-lib';
import FileModel from '../models/FileModel';

export const uploadFile = handler(async (event): Promise<unknown> => {
    return await FileModel.upload(event)
})