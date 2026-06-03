import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { fetchExpertises, fetchUserById, searchMentors, updateUserProfile } from "../thunks/userThunks"; 
import { Expertise } from "../../types/expertise";

interface UserState {
  expertises: Expertise[];
  mentors: User[];
  profileUser: User | null; 
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  expertises: [],
  mentors: [],
  profileUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profileUser = null;
      state.error = null;
    },
    // Update avatar in store
    updateAvatarSuccess: (state, action: PayloadAction<string>) => {
      if (state.profileUser) {
        state.profileUser.avatarUrl = action.payload;
        localStorage.setItem("user", JSON.stringify(state.profileUser));
      }
    },
    // Synchronize certificate list from API
    updateCertificatesSuccess: (state, action: PayloadAction<any[]>) => {
      if (state.profileUser) {
        state.profileUser.certificates = action.payload;
        localStorage.setItem("user", JSON.stringify(state.profileUser));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;      
        state.profileUser = action.payload; 
        console.log(state.profileUser)
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;     
        state.error = action.payload as string || "Can not fetch user data";
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        if (state.profileUser) {
          const currentRole = state.profileUser.roleName;
          const currentCerts = state.profileUser.certificates;
          state.profileUser = { 
            ...state.profileUser, 
            ...action.payload, 
            roleName: currentRole, 
            certificates: currentCerts 
          };
          localStorage.setItem("user", JSON.stringify(state.profileUser));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.[0] || "Update failed";
      })

      .addCase(fetchExpertises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpertises.fulfilled, (state, action: PayloadAction<Expertise[]>) => {
        state.loading = false;
        state.expertises = action.payload;
      })
      .addCase(fetchExpertises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Can not fetch expertises";
      })

      .addCase(searchMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMentors.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.mentors = action.payload;
      })
      .addCase(searchMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Can not search mentors";
      });

  },
});

export const { clearProfile, updateAvatarSuccess, updateCertificatesSuccess } = userSlice.actions;
export default userSlice.reducer;