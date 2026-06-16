using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resource_Courses_CourseId",
                table: "Resource");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Resource",
                table: "Resource");

            migrationBuilder.RenameTable(
                name: "Resource",
                newName: "Resources");

            migrationBuilder.RenameIndex(
                name: "IX_Resource_CourseId",
                table: "Resources",
                newName: "IX_Resources_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Resources",
                table: "Resources",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DashboardSummaries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalUser = table.Column<int>(type: "int", nullable: false),
                    TotalSession = table.Column<int>(type: "int", nullable: false),
                    TotalResource = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardSummaries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DashboardSummary_CreatedAt",
                table: "DashboardSummaries",
                column: "CreatedAt");

            migrationBuilder.AddForeignKey(
                name: "FK_Resources_Courses_CourseId",
                table: "Resources",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            //because our system's struggling in creating a new schema for hangfire but still can run db update,
            // so i infer that problem comes from the lack of account's permission in linux
            migrationBuilder.Sql(@"

                IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'HangFire')
                BEGIN
                    EXEC('CREATE SCHEMA [HangFire]');
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.AggregatedCounter'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.AggregatedCounter (
                        [Key] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Value bigint NOT NULL,
                        ExpireAt datetime NULL,
                        CONSTRAINT PK_HangFire_CounterAggregated PRIMARY KEY ([Key])
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_AggregatedCounter_ExpireAt' AND object_id = OBJECT_ID(N'LearningHub.HangFire.AggregatedCounter'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_AggregatedCounter_ExpireAt ON LearningHub.HangFire.AggregatedCounter (ExpireAt);
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.Counter'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.Counter (
                        [Key] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Value int NOT NULL,
                        ExpireAt datetime NULL,
                        Id bigint IDENTITY(1,1) NOT NULL,
                        CONSTRAINT PK_HangFire_Counter PRIMARY KEY ([Key],Id)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.Hash'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.Hash (
                        [Key] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Field nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Value nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        ExpireAt datetime2 NULL,
                        CONSTRAINT PK_HangFire_Hash PRIMARY KEY ([Key],Field)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_Hash_ExpireAt' AND object_id = OBJECT_ID(N'LearningHub.HangFire.Hash'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_Hash_ExpireAt ON LearningHub.HangFire.Hash (ExpireAt);
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.Job'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.Job (
                        Id bigint IDENTITY(1,1) NOT NULL,
                        StateId bigint NULL,
                        StateName nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        InvocationData nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Arguments nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        CreatedAt datetime NOT NULL,
                        ExpireAt datetime NULL,
                        CONSTRAINT PK_HangFire_Job PRIMARY KEY (Id)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_Job_ExpireAt' AND object_id = OBJECT_ID(N'LearningHub.HangFire.Job'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_Job_ExpireAt ON LearningHub.HangFire.Job (ExpireAt) INCLUDE (StateName);
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_Job_StateName' AND object_id = OBJECT_ID(N'LearningHub.HangFire.Job'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_Job_StateName ON LearningHub.HangFire.Job (StateName);
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.JobQueue'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.JobQueue (
                        Id bigint IDENTITY(1,1) NOT NULL,
                        JobId bigint NOT NULL,
                        Queue nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        FetchedAt datetime NULL,
                        CONSTRAINT PK_HangFire_JobQueue PRIMARY KEY (Queue,Id)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.List'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.List (
                        Id bigint IDENTITY(1,1) NOT NULL,
                        [Key] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Value nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        ExpireAt datetime NULL,
                        CONSTRAINT PK_HangFire_List PRIMARY KEY ([Key],Id)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_List_ExpireAt' AND object_id = OBJECT_ID(N'LearningHub.HangFire.List'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_List_ExpireAt ON LearningHub.HangFire.List (ExpireAt);
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.[Schema]'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.[Schema] (
                        Version int NOT NULL,
                        CONSTRAINT PK_HangFire_Schema PRIMARY KEY (Version)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.Server'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.Server (
                        Id nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        [Data] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        LastHeartbeat datetime NOT NULL,
                        CONSTRAINT PK_HangFire_Server PRIMARY KEY (Id)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_Server_LastHeartbeat' AND object_id = OBJECT_ID(N'LearningHub.HangFire.Server'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_Server_LastHeartbeat ON LearningHub.HangFire.Server (LastHeartbeat);
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.[Set]'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.[Set] (
                        [Key] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Score float NOT NULL,
                        Value nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        ExpireAt datetime NULL,
                        CONSTRAINT PK_HangFire_Set PRIMARY KEY ([Key],Value)
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_Set_ExpireAt' AND object_id = OBJECT_ID(N'LearningHub.HangFire.[Set]'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_Set_ExpireAt ON LearningHub.HangFire.[Set] (ExpireAt);
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_Set_Score' AND object_id = OBJECT_ID(N'LearningHub.HangFire.[Set]'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_Set_Score ON LearningHub.HangFire.[Set] ([Key], Score);
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.JobParameter'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.JobParameter (
                        JobId bigint NOT NULL,
                        Name nvarchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Value nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        CONSTRAINT PK_HangFire_JobParameter PRIMARY KEY (JobId,Name),
                        CONSTRAINT FK_HangFire_JobParameter_Job FOREIGN KEY (JobId) REFERENCES LearningHub.HangFire.Job(Id) ON DELETE CASCADE ON UPDATE CASCADE
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'LearningHub.HangFire.State'))
                BEGIN
                    CREATE TABLE LearningHub.HangFire.State (
                        Id bigint IDENTITY(1,1) NOT NULL,
                        JobId bigint NOT NULL,
                        Name nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
                        Reason nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        CreatedAt datetime NOT NULL,
                        [Data] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
                        CONSTRAINT PK_HangFire_State PRIMARY KEY (JobId,Id),
                        CONSTRAINT FK_HangFire_State_Job FOREIGN KEY (JobId) REFERENCES LearningHub.HangFire.Job(Id) ON DELETE CASCADE ON UPDATE CASCADE
                    );
                END;

                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HangFire_State_CreatedAt' AND object_id = OBJECT_ID(N'LearningHub.HangFire.State'))
                BEGIN
                    CREATE NONCLUSTERED INDEX IX_HangFire_State_CreatedAt ON LearningHub.HangFire.State (CreatedAt);
                END;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resources_Courses_CourseId",
                table: "Resources");

            migrationBuilder.DropTable(
                name: "DashboardSummaries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Resources",
                table: "Resources");

            migrationBuilder.RenameTable(
                name: "Resources",
                newName: "Resource");

            migrationBuilder.RenameIndex(
                name: "IX_Resources_CourseId",
                table: "Resource",
                newName: "IX_Resource_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Resource",
                table: "Resource",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Resource_Courses_CourseId",
                table: "Resource",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
