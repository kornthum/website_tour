import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    group_id: {
      type: String,
    },
    group_name: {
      type: String,
    },
  }
);

const GroupMapper = mongoose.model('GroupMapper', groupSchema, 'GroupMapper');

export default GroupMapper;